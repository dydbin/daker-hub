import { getSupabaseStatus } from "@/lib/supabase";

export default function AboutPage() {
  const supabaseStatus = getSupabaseStatus();

  return (
    <>
      <section className="page-head">
        <span className="eyebrow">Guide</span>
        <h1>배포 및 데이터 운영 가이드</h1>
        <p>이 프로젝트는 심사자가 공개 URL만으로 확인하고, 운영 비밀값은 서버 환경 변수에만 두는 방식으로 배포를 준비합니다.</p>
      </section>

      <section className="grid-layout grid-layout--cards">
        <article className="card section-card">
          <h2>Review</h2>
          <p>심사자는 배포 URL만 열면 주요 화면을 확인할 수 있고, 별도 API 키나 DB 계정을 받을 필요가 없습니다.</p>
        </article>
        <article className="card section-card">
          <h2>Account</h2>
          <p>공개 페이지 탐색은 로그인 없이 가능하고, 찜/팀/문의/제출 저장은 앱 안의 일반 회원가입 또는 로그인 후 확인할 수 있습니다.</p>
        </article>
        <article className="card section-card">
          <h2>Vercel</h2>
          <p>Next.js App Router 구조라서 별도 rewrite 없이 바로 프레임워크 감지 배포가 가능합니다.</p>
        </article>
        <article className="card section-card">
          <h2>Supabase</h2>
          <p>
            현재 런타임 상태: <strong>{supabaseStatus.ready ? "Supabase Live" : "Memory Fallback"}</strong>
          </p>
          <p>
            권장 설정은 <code>SUPABASE_URL</code> + <code>SUPABASE_SERVICE_ROLE_KEY</code> 입니다. 기존 <code>NEXT_PUBLIC_SUPABASE_URL</code>도
            호환용으로 읽지만, 이 값들은 운영자만 관리해야 합니다.
          </p>
          {supabaseStatus.ready ? (
            <p>
              연결 준비 완료. URL 소스는 <code>{supabaseStatus.urlEnvName}</code> 입니다.
              {supabaseStatus.usesLegacyPublicUrlFallback ? " 가능하면 서버 전용 SUPABASE_URL로 옮기는 편이 더 명확합니다." : ""}
            </p>
          ) : (
            <p>
              아직 빠진 값:{" "}
              <strong>
                {supabaseStatus.missingVars.map((name) => <code key={name}>{name}</code>).reduce((acc, item, index) => {
                  if (index === 0) return [item];
                  return [...acc, ", ", item];
                }, [])}
              </strong>
            </p>
          )}
        </article>
        <article className="card section-card">
          <h2>Fallback</h2>
          <p>환경 변수가 없으면 메모리 기반 데모 모드로 화면은 읽을 수 있지만, 제출용 Vercel 배포에서는 실사용 검증을 위해 Supabase Live 구성이 더 적합합니다.</p>
        </article>
      </section>

      <section className="card section-card">
        <h2>운영자 설정 순서</h2>
        <ol className="stack-list">
          <li>Supabase 프로젝트 생성</li>
          <li>`docs/supabase-schema.sql` 실행 또는 업데이트 재적용</li>
          <li>Vercel 또는 로컬 환경에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 설정</li>
          <li>배포 후 공개 URL에서 로그인 없이 메인/목록/상세/랭킹 흐름 확인</li>
          <li>배포 후 `/signup`, `/login`, `/camp`, `/mypage`에서 일반 사용자 쓰기 흐름 확인</li>
          <li>GitHub, README, PDF, 발표 자료에 비밀값이 없는지 마지막으로 확인</li>
        </ol>
      </section>
    </>
  );
}
