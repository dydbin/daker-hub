import "server-only";

import {
  createSessionExpiry,
  createSessionToken,
  hashPassword,
  hashSessionToken,
  normalizeEmail,
  verifyPassword
} from "@/lib/auth";
import { getSupabaseAdmin, getSupabaseStatus } from "@/lib/supabase";

const TABLES = {
  profiles: "profiles",
  accounts: "auth_accounts",
  sessions: "auth_sessions",
  favorites: "hackathon_favorites",
  teams: "camp_teams",
  messages: "team_messages",
  submissions: "hackathon_submissions"
};

function getMemoryStore() {
  if (!globalThis.__dakerBoardMemoryStore) {
    globalThis.__dakerBoardMemoryStore = {
      profiles: new Map(),
      accounts: [],
      sessions: [],
      favorites: [],
      teams: [],
      messages: [],
      submissions: []
    };
  }

  return globalThis.__dakerBoardMemoryStore;
}

function normalizeProfile(record) {
  if (!record) return null;

  return {
    ...record,
    is_profile_public: record.is_profile_public !== false,
    public_contact_email: normalizeEmail(record.public_contact_email ?? "") || "",
    is_contact_email_public: record.is_contact_email_public === true
  };
}

function normalizePublicContactEmail(value) {
  return normalizeEmail(value ?? "") || "";
}

async function getAccountById(userId) {
  if (!userId) return null;

  const client = getSupabaseAdmin();
  if (!client) {
    return getMemoryStore().accounts.find((item) => item.id === userId) ?? null;
  }

  const { data, error } = await client.from(TABLES.accounts).select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

async function getProfileById(userId) {
  if (!userId) return null;

  const client = getSupabaseAdmin();
  if (!client) {
    return normalizeProfile(getMemoryStore().profiles.get(userId) ?? null);
  }

  const { data, error } = await client.from(TABLES.profiles).select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return normalizeProfile(data ?? null);
}

export function getStorageMode() {
  return getSupabaseStatus().mode;
}

function teamSort(left, right) {
  return new Date(right.created_at ?? right.createdAt ?? 0).getTime() - new Date(left.created_at ?? left.createdAt ?? 0).getTime();
}

function isMissingColumnError(error, columnName) {
  if (!error || !columnName) return false;
  const haystack = `${error.message ?? ""} ${error.details ?? ""} ${error.hint ?? ""}`;
  return haystack.includes(columnName);
}

async function insertTeamRecord(client, record) {
  const { data, error } = await client.from(TABLES.teams).insert(record).select("*").single();
  if (!error) return data;

  if (isMissingColumnError(error, "target_member_count") || isMissingColumnError(error, "recruitment_deadline_at")) {
    const legacyRecord = { ...record };
    delete legacyRecord.target_member_count;
    delete legacyRecord.recruitment_deadline_at;

    const retry = await client.from(TABLES.teams).insert(legacyRecord).select("*").single();
    if (retry.error) throw retry.error;
    return retry.data;
  }

  throw error;
}

async function updateTeamRecord(client, teamId, visitorId, patch) {
  const { data, error } = await client
    .from(TABLES.teams)
    .update(patch)
    .eq("id", teamId)
    .eq("owner_id", visitorId)
    .select("*")
    .maybeSingle();
  if (!error) return data;

  if (isMissingColumnError(error, "target_member_count") || isMissingColumnError(error, "recruitment_deadline_at")) {
    const legacyPatch = { ...patch };
    delete legacyPatch.target_member_count;
    delete legacyPatch.recruitment_deadline_at;

    const retry = await client
      .from(TABLES.teams)
      .update(legacyPatch)
      .eq("id", teamId)
      .eq("owner_id", visitorId)
      .select("*")
      .maybeSingle();
    if (retry.error) throw retry.error;
    return retry.data;
  }

  throw error;
}

export async function upsertProfile({ visitorId, displayName, isProfilePublic, publicContactEmail, isContactEmailPublic }) {
  if (!visitorId) {
    throw new Error("프로필 식별자가 필요합니다.");
  }

  const client = getSupabaseAdmin();
  const currentProfile = await getProfileById(visitorId);
  const resolvedProfileVisibility = isProfilePublic ?? currentProfile?.is_profile_public ?? true;
  const resolvedPublicContactEmail = publicContactEmail ?? currentProfile?.public_contact_email ?? "";
  const resolvedContactEmailVisibility = isContactEmailPublic ?? currentProfile?.is_contact_email_public ?? false;

  if (!client) {
    const record = normalizeProfile({
      id: visitorId,
      display_name: displayName,
      is_profile_public: resolvedProfileVisibility,
      public_contact_email: normalizePublicContactEmail(resolvedPublicContactEmail),
      is_contact_email_public: Boolean(resolvedPublicContactEmail) && resolvedContactEmailVisibility,
      updated_at: new Date().toISOString()
    });
    getMemoryStore().profiles.set(visitorId, record);
    return record;
  }

  const payload = {
    id: visitorId,
    display_name: displayName,
    is_profile_public: resolvedProfileVisibility,
    public_contact_email: normalizePublicContactEmail(resolvedPublicContactEmail),
    is_contact_email_public: Boolean(resolvedPublicContactEmail) && resolvedContactEmailVisibility,
    updated_at: new Date().toISOString()
  };
  const { data, error } = await client.from(TABLES.profiles).upsert(payload).select("*").single();
  if (error) throw error;
  return normalizeProfile(data);
}

export async function updateAccountProfile({ userId, email, displayName, publicContactEmail, isContactEmailPublic }) {
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  const currentAccount = await getAccountById(userId);
  if (!currentAccount) {
    throw new Error("계정 정보를 찾을 수 없습니다.");
  }

  const client = getSupabaseAdmin();
  const nextEmail = normalizeEmail(email) || currentAccount.email;
  if (!nextEmail) {
    throw new Error("로그인 이메일이 필요합니다.");
  }

  if (nextEmail !== currentAccount.email) {
    if (!client) {
      const store = getMemoryStore();
      const existing = store.accounts.find((item) => item.email === nextEmail && item.id !== userId);
      if (existing) {
        throw new Error("이미 사용 중인 로그인 이메일입니다.");
      }
      store.accounts = store.accounts.map((item) => (item.id === userId ? { ...item, email: nextEmail } : item));
    } else {
      const { data: existing, error: existingError } = await client
        .from(TABLES.accounts)
        .select("id")
        .eq("email", nextEmail)
        .neq("id", userId)
        .maybeSingle();
      if (existingError) throw existingError;
      if (existing) {
        throw new Error("이미 사용 중인 로그인 이메일입니다.");
      }

      const { error } = await client.from(TABLES.accounts).update({ email: nextEmail }).eq("id", userId);
      if (error) throw error;
    }
  }

  const currentProfile = await getProfileById(userId);
  const nextDisplayName = displayName ?? currentProfile?.display_name ?? "사용자";
  const nextPublicContactEmail = normalizePublicContactEmail(publicContactEmail ?? currentProfile?.public_contact_email ?? "");
  const profile = await upsertProfile({
    visitorId: userId,
    displayName: nextDisplayName,
    isProfilePublic: currentProfile?.is_profile_public ?? true,
    publicContactEmail: nextPublicContactEmail,
    isContactEmailPublic: Boolean(nextPublicContactEmail) && isContactEmailPublic
  });

  return {
    email: nextEmail,
    profile
  };
}

export async function listProfilesByIds(userIds = []) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  if (!uniqueIds.length) return {};

  const client = getSupabaseAdmin();

  if (!client) {
    return uniqueIds.reduce((bucket, userId) => {
      const profile = normalizeProfile(getMemoryStore().profiles.get(userId) ?? null);
      if (profile) {
        bucket[userId] = profile;
      }
      return bucket;
    }, {});
  }

  const { data, error } = await client.from(TABLES.profiles).select("*").in("id", uniqueIds);
  if (error) throw error;

  return (data ?? []).reduce((bucket, item) => {
    bucket[item.id] = normalizeProfile(item);
    return bucket;
  }, {});
}

export async function createAccount({ email, password, displayName }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error("이메일이 필요합니다.");
  }

  const client = getSupabaseAdmin();
  const userId = crypto.randomUUID();
  const { salt, hash } = hashPassword(password);

  if (!client) {
    const store = getMemoryStore();
    const existing = store.accounts.find((item) => item.email === normalizedEmail);
    if (existing) {
      throw new Error("이미 가입된 이메일입니다.");
    }

    const profile = await upsertProfile({
      visitorId: userId,
      displayName,
      isProfilePublic: true,
      publicContactEmail: "",
      isContactEmailPublic: false
    });
    store.accounts.push({
      id: userId,
      email: normalizedEmail,
      password_salt: salt,
      password_hash: hash,
      created_at: new Date().toISOString()
    });
    return {
      userId,
      email: normalizedEmail,
      displayName: profile.display_name,
      isProfilePublic: profile.is_profile_public,
      publicContactEmail: profile.public_contact_email,
      isContactEmailPublic: profile.is_contact_email_public
    };
  }

  const { data: existing, error: selectError } = await client
    .from(TABLES.accounts)
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();
  if (selectError) throw selectError;
  if (existing) {
    throw new Error("이미 가입된 이메일입니다.");
  }

  const profile = await upsertProfile({
    visitorId: userId,
    displayName,
    isProfilePublic: true,
    publicContactEmail: "",
    isContactEmailPublic: false
  });

  const { error } = await client.from(TABLES.accounts).insert({
    id: userId,
    email: normalizedEmail,
    password_salt: salt,
    password_hash: hash,
    created_at: new Date().toISOString()
  });
  if (error) throw error;

  return {
    userId,
    email: normalizedEmail,
    displayName: profile.display_name,
    isProfilePublic: profile.is_profile_public,
    publicContactEmail: profile.public_contact_email,
    isContactEmailPublic: profile.is_contact_email_public
  };
}

export async function authenticateAccount({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error("이메일이 필요합니다.");
  }

  const client = getSupabaseAdmin();

  if (!client) {
    const store = getMemoryStore();
    const account = store.accounts.find((item) => item.email === normalizedEmail) ?? null;
    if (!account || !verifyPassword(password, account.password_salt, account.password_hash)) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const profile = normalizeProfile(store.profiles.get(account.id) ?? null);
    return {
      userId: account.id,
      email: account.email,
      displayName: profile?.display_name ?? "사용자",
      isProfilePublic: profile?.is_profile_public !== false,
      publicContactEmail: profile?.public_contact_email ?? "",
      isContactEmailPublic: profile?.is_contact_email_public === true
    };
  }

  const { data: account, error } = await client
    .from(TABLES.accounts)
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();
  if (error) throw error;
  if (!account || !verifyPassword(password, account.password_salt, account.password_hash)) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const profile = await getProfileById(account.id);

  return {
    userId: account.id,
    email: account.email,
    displayName: profile?.display_name ?? "사용자",
    isProfilePublic: profile?.is_profile_public !== false,
    publicContactEmail: profile?.public_contact_email ?? "",
    isContactEmailPublic: profile?.is_contact_email_public === true
  };
}

export async function createAuthSession({ userId }) {
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  const client = getSupabaseAdmin();
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = createSessionExpiry();

  if (!client) {
    const store = getMemoryStore();
    store.sessions = store.sessions.filter((item) => item.account_id !== userId);
    store.sessions.push({
      id: crypto.randomUUID(),
      account_id: userId,
      token_hash: tokenHash,
      created_at: new Date().toISOString(),
      expires_at: expiresAt
    });
    return {
      token,
      expiresAt
    };
  }

  await client.from(TABLES.sessions).delete().eq("account_id", userId);

  const { error } = await client.from(TABLES.sessions).insert({
    id: crypto.randomUUID(),
    account_id: userId,
    token_hash: tokenHash,
    created_at: new Date().toISOString(),
    expires_at: expiresAt
  });
  if (error) throw error;

  return {
    token,
    expiresAt
  };
}

export async function getAuthSessionByToken(token) {
  if (!token) return null;

  const client = getSupabaseAdmin();
  const tokenHash = hashSessionToken(token);

  if (!client) {
    const store = getMemoryStore();
    const session = store.sessions.find((item) => item.token_hash === tokenHash) ?? null;
    if (!session) return null;
    if (new Date(session.expires_at).getTime() <= Date.now()) {
      store.sessions = store.sessions.filter((item) => item.token_hash !== tokenHash);
      return null;
    }

    const account = store.accounts.find((item) => item.id === session.account_id) ?? null;
    const profile = normalizeProfile(store.profiles.get(session.account_id) ?? null);
    if (!account || !profile) return null;

    return {
      userId: account.id,
      email: account.email,
      displayName: profile.display_name,
      isProfilePublic: profile.is_profile_public,
      publicContactEmail: profile.public_contact_email,
      isContactEmailPublic: profile.is_contact_email_public
    };
  }

  const { data: session, error } = await client
    .from(TABLES.sessions)
    .select("*")
    .eq("token_hash", tokenHash)
    .maybeSingle();
  if (error) throw error;
  if (!session) return null;

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    await client.from(TABLES.sessions).delete().eq("token_hash", tokenHash);
    return null;
  }

  const [{ data: account, error: accountError }, profile] = await Promise.all([
    client.from(TABLES.accounts).select("*").eq("id", session.account_id).maybeSingle(),
    getProfileById(session.account_id)
  ]);
  if (accountError) throw accountError;
  if (!account || !profile) return null;

  return {
    userId: account.id,
    email: account.email,
    displayName: profile.display_name,
    isProfilePublic: profile.is_profile_public,
    publicContactEmail: profile.public_contact_email,
    isContactEmailPublic: profile.is_contact_email_public
  };
}

export async function deleteAuthSession(token) {
  if (!token) return;

  const client = getSupabaseAdmin();
  const tokenHash = hashSessionToken(token);

  if (!client) {
    const store = getMemoryStore();
    store.sessions = store.sessions.filter((item) => item.token_hash !== tokenHash);
    return;
  }

  const { error } = await client.from(TABLES.sessions).delete().eq("token_hash", tokenHash);
  if (error) throw error;
}

export async function listFavorites(visitorId) {
  if (!visitorId) return [];

  const client = getSupabaseAdmin();
  if (!client) {
    return getMemoryStore().favorites.filter((item) => item.visitor_id === visitorId);
  }

  const { data, error } = await client.from(TABLES.favorites).select("*").eq("visitor_id", visitorId);
  if (error) throw error;
  return data ?? [];
}

export async function toggleFavorite({ visitorId, hackathonSlug }) {
  if (!visitorId) {
    throw new Error("찜 기능은 로그인 후 사용할 수 있습니다.");
  }

  const client = getSupabaseAdmin();

  if (!client) {
    const store = getMemoryStore();
    const existingIndex = store.favorites.findIndex(
      (item) => item.visitor_id === visitorId && item.hackathon_slug === hackathonSlug
    );
    if (existingIndex >= 0) {
      store.favorites.splice(existingIndex, 1);
      return { active: false };
    }

    store.favorites.push({
      id: crypto.randomUUID(),
      visitor_id: visitorId,
      hackathon_slug: hackathonSlug,
      created_at: new Date().toISOString()
    });
    return { active: true };
  }

  const { data: existing, error: selectError } = await client
    .from(TABLES.favorites)
    .select("id")
    .eq("visitor_id", visitorId)
    .eq("hackathon_slug", hackathonSlug)
    .maybeSingle();
  if (selectError) throw selectError;

  if (existing) {
    const { error } = await client.from(TABLES.favorites).delete().eq("id", existing.id);
    if (error) throw error;
    return { active: false };
  }

  const { error } = await client.from(TABLES.favorites).insert({
    visitor_id: visitorId,
    hackathon_slug: hackathonSlug
  });
  if (error) throw error;
  return { active: true };
}

export async function listTeams({ hackathonSlug } = {}) {
  const client = getSupabaseAdmin();

  if (!client) {
    return getMemoryStore().teams
      .filter((team) => !hackathonSlug || team.hackathon_slug === hackathonSlug)
      .sort(teamSort);
  }

  let query = client.from(TABLES.teams).select("*").order("created_at", { ascending: false });
  if (hackathonSlug) {
    query = query.eq("hackathon_slug", hackathonSlug);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createTeam(payload) {
  const client = getSupabaseAdmin();
  const record = {
    id: crypto.randomUUID(),
    hackathon_slug: payload.hackathonSlug || null,
    name: payload.name,
    intro: payload.intro,
    looking_for: payload.lookingFor,
    target_member_count: payload.targetMemberCount ?? 4,
    recruitment_deadline_at: payload.recruitmentDeadlineAt || null,
    contact_url: payload.contactUrl || null,
    is_open: payload.isOpen,
    owner_id: payload.visitorId,
    owner_name: payload.displayName,
    member_count: payload.participationMode === "solo" ? 0 : 1,
    created_at: new Date().toISOString()
  };

  if (!client) {
    getMemoryStore().teams.unshift(record);
    return record;
  }

  return insertTeamRecord(client, record);
}

export async function getTeamById(teamId) {
  const client = getSupabaseAdmin();

  if (!client) {
    return getMemoryStore().teams.find((item) => item.id === teamId) ?? null;
  }

  const { data, error } = await client.from(TABLES.teams).select("*").eq("id", teamId).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function toggleTeamOpen({ teamId, visitorId }) {
  const client = getSupabaseAdmin();

  if (!client) {
    const store = getMemoryStore();
    const team = store.teams.find((item) => item.id === teamId && item.owner_id === visitorId);
    if (!team) throw new Error("권한이 없는 팀입니다.");
    team.is_open = !team.is_open;
    return team;
  }

  const { data: current, error: readError } = await client
    .from(TABLES.teams)
    .select("*")
    .eq("id", teamId)
    .eq("owner_id", visitorId)
    .single();
  if (readError) throw readError;

  const { data, error } = await client
    .from(TABLES.teams)
    .update({ is_open: !current.is_open })
    .eq("id", teamId)
    .eq("owner_id", visitorId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateTeam({
  teamId,
  visitorId,
  hackathonSlug,
  name,
  intro,
  lookingFor,
  targetMemberCount,
  recruitmentDeadlineAt,
  contactUrl,
  isOpen
}) {
  const client = getSupabaseAdmin();
  const currentTeam = await getTeamById(teamId);
  if (!currentTeam || currentTeam.owner_id !== visitorId) {
    throw new Error("권한이 없는 팀입니다.");
  }

  const wasSoloEntry = Number(currentTeam.member_count ?? currentTeam.memberCount ?? 1) === 0;
  const normalizedIsOpen = Boolean(isOpen);
  const patch = {
    hackathon_slug: hackathonSlug || null,
    name,
    intro,
    looking_for: lookingFor,
    target_member_count: targetMemberCount ?? 4,
    recruitment_deadline_at: recruitmentDeadlineAt || null,
    contact_url: contactUrl || null,
    is_open: normalizedIsOpen,
    member_count: wasSoloEntry ? (normalizedIsOpen ? 1 : 0) : Number(currentTeam.member_count ?? currentTeam.memberCount ?? 1) || 1
  };

  if (!client) {
    const store = getMemoryStore();
    const team = store.teams.find((item) => item.id === teamId && item.owner_id === visitorId);
    if (!team) throw new Error("권한이 없는 팀입니다.");
    Object.assign(team, patch);
    return team;
  }

  const data = await updateTeamRecord(client, teamId, visitorId, patch);
  const error = null;
  if (error) throw error;
  if (!data) throw new Error("권한이 없는 팀입니다.");
  return data;
}

export async function listMessagesByTeamIds(teamIds = []) {
  if (!teamIds.length) return {};

  const client = getSupabaseAdmin();
  let rows = [];

  if (!client) {
    rows = getMemoryStore().messages.filter((item) => teamIds.includes(item.team_id));
  } else {
    const { data, error } = await client
      .from(TABLES.messages)
      .select("*")
      .in("team_id", teamIds)
      .order("created_at", { ascending: true });
    if (error) throw error;
    rows = data ?? [];
  }

  return rows.reduce((bucket, item) => {
    const list = bucket[item.team_id] ?? [];
    list.push(item);
    bucket[item.team_id] = list;
    return bucket;
  }, {});
}

export async function addMessage(payload) {
  const client = getSupabaseAdmin();
  const record = {
    id: crypto.randomUUID(),
    team_id: payload.teamId,
    visitor_id: payload.visitorId,
    visitor_name: payload.displayName,
    body: payload.body,
    created_at: new Date().toISOString()
  };

  if (!client) {
    getMemoryStore().messages.push(record);
    return record;
  }

  const { data, error } = await client.from(TABLES.messages).insert(record).select("*").single();
  if (error) throw error;
  return data;
}

export async function requestTeamJoin({ teamId, visitorId, displayName }) {
  const team = await getTeamById(teamId);
  if (!team) {
    throw new Error("합류할 팀을 찾을 수 없습니다.");
  }
  if (!team.is_open) {
    throw new Error("이미 모집이 마감된 팀입니다.");
  }
  if (team.owner_id === visitorId) {
    throw new Error("내가 만든 팀에는 합류 신청할 수 없습니다.");
  }

  const body = `${displayName}님이 이 팀에 합류 신청했습니다.`;
  const client = getSupabaseAdmin();

  if (!client) {
    const existing = getMemoryStore().messages.find(
      (item) => item.team_id === teamId && item.visitor_id === visitorId && item.body === body
    );
    if (existing) {
      return { message: existing, alreadyRequested: true };
    }

    const message = await addMessage({
      teamId,
      visitorId,
      displayName,
      body
    });
    return { message, alreadyRequested: false };
  }

  const { data: existing, error: selectError } = await client
    .from(TABLES.messages)
    .select("*")
    .eq("team_id", teamId)
    .eq("visitor_id", visitorId)
    .eq("body", body)
    .maybeSingle();
  if (selectError) throw selectError;

  if (existing) {
    return { message: existing, alreadyRequested: true };
  }

  const message = await addMessage({
    teamId,
    visitorId,
    displayName,
    body
  });
  return { message, alreadyRequested: false };
}

export async function listSubmissions({ hackathonSlug } = {}) {
  const client = getSupabaseAdmin();

  if (!client) {
    return getMemoryStore().submissions
      .filter((item) => !hackathonSlug || item.hackathon_slug === hackathonSlug)
      .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
  }

  let query = client.from(TABLES.submissions).select("*").order("created_at", { ascending: false });
  if (hackathonSlug) {
    query = query.eq("hackathon_slug", hackathonSlug);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createSubmission(payload) {
  const client = getSupabaseAdmin();
  const record = {
    id: crypto.randomUUID(),
    hackathon_slug: payload.hackathonSlug,
    visitor_id: payload.visitorId,
    visitor_name: payload.displayName,
    project_title: payload.projectTitle,
    team_participants: payload.teamParticipants,
    service_overview: payload.serviceOverview,
    page_composition: payload.pageComposition,
    system_composition: payload.systemComposition,
    core_function_spec: payload.coreFunctionSpec,
    user_flow: payload.userFlow,
    development_plan: payload.developmentPlan,
    created_at: new Date().toISOString()
  };

  if (!client) {
    getMemoryStore().submissions.unshift(record);
    return record;
  }

  const { data, error } = await client.from(TABLES.submissions).insert(record).select("*").single();
  if (error) throw error;
  return data;
}
