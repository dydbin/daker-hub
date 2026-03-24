import Link from "next/link";

export default function NotFound() {
  return (
    <section className="card empty-card">
      <span className="eyebrow">404</span>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>메인으로 돌아가 다시 탐색해보세요.</p>
      <Link className="button" href="/">
        홈으로
      </Link>
    </section>
  );
}
