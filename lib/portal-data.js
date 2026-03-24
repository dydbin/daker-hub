import { loadCatalog } from "@/lib/catalog";
import { getPublicContactEmail, getPublicDisplayName } from "@/lib/privacy";
import {
  getStorageMode,
  listFavorites,
  listProfilesByIds,
  listSubmissions,
  listTeams
} from "@/lib/store";

export async function loadPortalData(visitorId) {
  const catalog = await loadCatalog();
  const [favorites, sharedTeams, sharedSubmissions] = await Promise.all([
    listFavorites(visitorId),
    listTeams(),
    listSubmissions()
  ]);
  const profilesById = await listProfilesByIds([
    ...sharedTeams.map((item) => item.owner_id),
    ...sharedSubmissions.map((item) => item.visitor_id)
  ]);
  const decoratedTeams = sharedTeams.map((team) => ({
    ...team,
    owner_public_name: getPublicDisplayName({
      viewerId: visitorId,
      subjectId: team.owner_id,
      fallbackName: team.owner_name,
      profilesById
    }),
    owner_public_contact_email: getPublicContactEmail({
      viewerId: visitorId,
      subjectId: team.owner_id,
      profilesById
    })
  }));
  const decoratedSubmissions = sharedSubmissions.map((submission) => ({
    ...submission,
    author_public_name: getPublicDisplayName({
      viewerId: visitorId,
      subjectId: submission.visitor_id,
      fallbackName: submission.visitor_name,
      profilesById
    })
  }));

  const favoriteSlugs = new Set(favorites.map((item) => item.hackathon_slug));
  const teamsBySlug = decoratedTeams.reduce((bucket, team) => {
    const key = team.hackathon_slug || "unlinked";
    const list = bucket[key] ?? [];
    list.push(team);
    bucket[key] = list;
    return bucket;
  }, {});
  const submissionsBySlug = decoratedSubmissions.reduce((bucket, item) => {
    const list = bucket[item.hackathon_slug] ?? [];
    list.push(item);
    bucket[item.hackathon_slug] = list;
    return bucket;
  }, {});

  return {
    ...catalog,
    favoriteSlugs,
    teamsBySlug,
    sharedTeams: decoratedTeams,
    sharedSubmissions: decoratedSubmissions,
    submissionsBySlug,
    profilesById,
    storageMode: getStorageMode()
  };
}

export async function loadHackathonPageData(visitorId, slug) {
  const portalData = await loadPortalData(visitorId);
  const hackathon = portalData.hackathons.find((item) => item.slug === slug) ?? null;
  if (!hackathon) return null;

  const teams = [
    ...(hackathon.officialTeams ?? []),
    ...(portalData.teamsBySlug[slug] ?? [])
  ];
  const submissions = portalData.submissionsBySlug[slug] ?? [];

  return {
    ...portalData,
    hackathon,
    teams,
    submissions
  };
}
