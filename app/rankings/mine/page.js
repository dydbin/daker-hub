import Link from "next/link";
import { cookies } from "next/headers";

import { formatDateTime } from "@/lib/format";
import { loadPortalData } from "@/lib/portal-data";
import { getViewerSession } from "@/lib/visitor";

export const dynamic = "force-dynamic";

export default async function MyRankingsPage() {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  const portal = await loadPortalData(session.userId);
  const myRows = portal.sharedSubmissions.filter((item) => item.visitor_id === session.userId);

  return (
    <>
      <section className="page-head">
        <span className="eyebrow">Rankings</span>
        <h1>내 리더보드</h1>
        <p>내가 저장한 공유 제출과 참여 흐름만 따로 보는 전용 페이지입니다.</p>
      </section>

      <section className="card filter-card">
        <div className="ranking-toolbar">
          <div className="button-row">
            <Link className="button button--ghost" href="/rankings">
              전체
            </Link>
            <Link className="button" href="/rankings/mine">
              내 리더보드
            </Link>
          </div>
          <div className="button-row button-row--end">
            <span className="small-note">기간 필터는 전체 해커톤 순위에서만 적용됩니다.</span>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <span className="eyebrow">Mine</span>
          <h2>내 공유 제출</h2>
        </div>
        <div className="stack-list">
          {myRows.length ? (
            myRows.map((item) => (
              <article className="list-row" key={item.id}>
                <div>
                  <strong>{item.project_title}</strong>
                  <p>
                    {item.team_participants} · {formatDateTime(item.created_at)}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <article className="empty-card">
              <h3>아직 내 제출이 없습니다.</h3>
              <p>상세 페이지의 제출 개요 폼으로 공유 제출 상태를 남길 수 있습니다.</p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
