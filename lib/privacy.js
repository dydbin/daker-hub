export function getPublicDisplayName({ viewerId, subjectId, fallbackName, profilesById = {} }) {
  if (!subjectId) {
    return fallbackName ?? "공개 사용자";
  }

  const profile = profilesById[subjectId] ?? null;
  const resolvedName = profile?.display_name ?? fallbackName ?? "공개 사용자";

  return resolvedName;
}

export function getPublicContactEmail({ viewerId, subjectId, profilesById = {} }) {
  if (!subjectId) return "";

  const profile = profilesById[subjectId] ?? null;
  const resolvedEmail = profile?.public_contact_email ?? "";

  if (!resolvedEmail) return "";
  if (viewerId && subjectId === viewerId) return resolvedEmail;
  if (profile?.is_contact_email_public !== true) return "";
  return resolvedEmail;
}
