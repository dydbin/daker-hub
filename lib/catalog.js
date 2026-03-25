import fs from "fs/promises";
import path from "path";

const FEATURED_SLUG = "daker-handover-2026-03";
const DATA_DIR = path.join(process.cwd(), "data");

let catalogPromise = null;

async function readJson(filename) {
  const target = path.join(DATA_DIR, filename);
  const raw = await fs.readFile(target, "utf8");
  return JSON.parse(raw);
}

function bySlug(list, key = "slug") {
  return new Map(list.map((item) => [item[key], item]));
}

function inferHackathonStatus(hackathon) {
  const now = Date.now();
  const startAt = hackathon.period?.startAt ?? null;
  const endAt = hackathon.period?.endAt ?? hackathon.period?.submissionDeadlineAt ?? null;

  if (endAt && new Date(endAt).getTime() < now) {
    return "ended";
  }

  if (startAt && new Date(startAt).getTime() > now) {
    return "upcoming";
  }

  if (startAt && endAt) {
    return "ongoing";
  }

  return hackathon.status;
}

export async function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = Promise.all([
      readJson("public_hackathon_detail.json"),
      readJson("public_hackathons.json"),
      readJson("public_leaderboard.json"),
      readJson("public_teams.json")
    ]).then(([detailRoot, hackathons, leaderboardRoot, teams]) => {
      const detailEntries = [detailRoot, ...(detailRoot.extraDetails ?? [])];
      const detailsBySlug = bySlug(detailEntries);
      const leaderboardEntries = [
        {
          hackathonSlug: leaderboardRoot.hackathonSlug,
          updatedAt: leaderboardRoot.updatedAt,
          entries: leaderboardRoot.entries ?? []
        },
        ...(leaderboardRoot.extraLeaderboards ?? [])
      ];
      const leaderboardsBySlug = bySlug(leaderboardEntries, "hackathonSlug");
      const teamsBySlug = teams.reduce((bucket, team) => {
        const list = bucket.get(team.hackathonSlug) ?? [];
        list.push(team);
        bucket.set(team.hackathonSlug, list);
        return bucket;
      }, new Map());
      const tags = [...new Set(hackathons.flatMap((item) => item.tags ?? []))].sort();
      const hackathonList = hackathons.map((hackathon) => ({
        ...hackathon,
        status: inferHackathonStatus(hackathon),
        detail: detailsBySlug.get(hackathon.slug) ?? null,
        leaderboard: leaderboardsBySlug.get(hackathon.slug) ?? { entries: [] },
        officialTeams: teamsBySlug.get(hackathon.slug) ?? []
      }));

      return {
        featuredSlug: FEATURED_SLUG,
        featuredHackathon: hackathonList.find((item) => item.slug === FEATURED_SLUG) ?? hackathonList[0] ?? null,
        hackathons: hackathonList,
        detailsBySlug,
        leaderboardsBySlug,
        teamsBySlug,
        tags
      };
    });
  }

  return catalogPromise;
}

export async function getHackathonBySlug(slug) {
  const catalog = await loadCatalog();
  return catalog.hackathons.find((item) => item.slug === slug) ?? null;
}
