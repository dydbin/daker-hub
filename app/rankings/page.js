import { cookies } from "next/headers";
import Link from "next/link";

import { loadPortalData } from "@/lib/portal-data";
import { getViewerSession } from "@/lib/visitor";

export const dynamic = "force-dynamic";

function getPeriodCutoff(rows, period) {
  if (period === "all") return 0;
  const latest = rows.reduce((max, row) => Math.max(max, new Date(row.submittedAt).getTime()), 0);
  const reference = latest || Date.now();
  const days = period === "7" ? 7 : 30;
  return reference - days * 24 * 60 * 60 * 1000;
}

function computeGlobalPoints(entry) {
  const placementPoints = Math.max(10, 120 - (entry.rank - 1) * 20);
  const scoreBonus =
    typeof entry.score === "number"
      ? entry.score < 1
        ? Math.round(entry.score * 40)
        : Math.round(entry.score / 5)
      : 0;

  return placementPoints + scoreBonus;
}

export default async function RankingsPage({ searchParams }) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  const portal = await loadPortalData(session.userId);
  const period = ["7", "30", "all"].includes(params.period) ? params.period : "all";

  const leaderboardEntries = portal.hackathons
    .flatMap((hackathon) =>
      (hackathon.leaderboard?.entries ?? []).map((entry) => ({
        rank: entry.rank,
        teamName: entry.teamName,
        score: entry.score,
        submittedAt: entry.submittedAt
      }))
    );

  const cutoff = getPeriodCutoff(leaderboardEntries, period);
  const buckets = leaderboardEntries.reduce((map, entry) => {
    const submittedAt = new Date(entry.submittedAt).getTime();
    if (submittedAt < cutoff) return map;

    const nickname = entry.teamName;
    const current = map.get(nickname) ?? { nickname, points: 0 };
    current.points += computeGlobalPoints(entry);
    map.set(nickname, current);
    return map;
  }, new Map());

  const globalRows = [...buckets.values()]
    .sort((left, right) => right.points - left.points)
    .map((entry, index) => ({
      rank: index + 1,
      nickname: entry.nickname,
      points: entry.points
    }));
  const topThree = globalRows.slice(0, 3);
  const personalSavedCount = portal.sharedSubmissions.filter((item) => item.visitor_id === session.userId).length;
  const periodLabel = period === "7" ? "최근 7일" : period === "30" ? "최근 30일" : "전체 기간";

  return (
    <>
      <section className="page-head">
        <span className="eyebrow">Rankings</span>
        <h1>전체 해커톤 순위</h1>
        <p>전체 해커톤 공개 리더보드를 points 기준으로 합산해 기간별 순위를 봅니다.</p>
      </section>

      <section className="ranking-hero card">
        <div className="ranking-hero__intro">
          <span className="eyebrow">Global Points</span>
          <h2>{periodLabel} 랭킹 보드</h2>
          <p>공개 리더보드 점수를 한데 모아 기간별 경쟁 흐름을 빠르게 스캔할 수 있게 정리했습니다.</p>
        </div>
        <div className="board-summary-grid">
          <article className="stat-card board-summary-card">
            <span>집계 팀</span>
            <strong>{globalRows.length}</strong>
            <small>현재 조건에 포함된 전체 팀 수</small>
          </article>
          <article className="stat-card board-summary-card">
            <span>현재 1위</span>
            <strong>{globalRows[0]?.nickname ?? "-"}</strong>
            <small>{globalRows[0] ? `${globalRows[0].points} points` : "아직 공개 데이터가 없습니다."}</small>
          </article>
          <article className="stat-card board-summary-card">
            <span>조회 기간</span>
            <strong>{periodLabel}</strong>
            <small>기간 필터는 전체 랭킹 보드에만 적용됩니다.</small>
          </article>
          <article className="stat-card board-summary-card">
            <span>내 저장 제출</span>
            <strong>{personalSavedCount}</strong>
            <small>{session.isAuthenticated ? "내 리더보드에서 다시 확인할 수 있습니다." : "로그인 후 내 리더보드를 사용할 수 있습니다."}</small>
          </article>
        </div>
      </section>

      <section className="card filter-card">
        <div className="ranking-toolbar">
          <div className="button-row">
            <Link className="button" href="/rankings">
              전체
            </Link>
            <Link className="button button--ghost" href="/rankings/mine">
              내 리더보드
            </Link>
          </div>
          <div className="button-row button-row--end">
            <Link className={`button ${period === "7" ? "" : "button--ghost"}`} href="/rankings?period=7">
              최근 7일
            </Link>
            <Link className={`button ${period === "30" ? "" : "button--ghost"}`} href="/rankings?period=30">
              최근 30일
            </Link>
            <Link className={`button ${period === "all" ? "" : "button--ghost"}`} href="/rankings">
              전체
            </Link>
          </div>
        </div>
      </section>

      {topThree.length ? (
        <section className="ranking-podium">
          {topThree.map((row) => (
            <article className="card ranking-podium__card" key={row.nickname}>
              <span className="ranking-podium__rank">#{row.rank}</span>
              <strong>{row.nickname}</strong>
              <p>{row.points} points</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className="card">
        <div className="section-head">
          <span className="eyebrow">Global Points</span>
          <h2>전체 해커톤 순위</h2>
        </div>
        {globalRows.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>순위</th>
                  <th>닉네임</th>
                  <th>points</th>
                </tr>
              </thead>
              <tbody>
                {globalRows.map((row) => (
                  <tr key={row.nickname}>
                    <td>#{row.rank}</td>
                    <td>{row.nickname}</td>
                    <td>{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <article className="empty-card">
            <h3>랭킹 데이터가 없습니다.</h3>
            <p>선택한 기간 안에 공개 리더보드 기록이 없습니다.</p>
          </article>
        )}
      </section>
    </>
  );
}
