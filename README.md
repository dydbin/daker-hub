# Daker Hub

Daker Hub는 해커톤 탐색, 팀 모집, 랭킹, 제출 준비를 한 흐름으로 묶은 공개 해커톤 포털입니다.  
이제 구조는 **Next.js(App Router) + Supabase + Vercel** 기준으로 정리되어, 심사자는 공개 배포 URL만으로 서비스를 확인하고 운영 비밀값은 서버 환경 변수에만 두는 방식을 목표로 합니다.

## 현재 아키텍처
- 프론트/서버 렌더링: Next.js 16 App Router
- 배포 타깃: Vercel
- 공유 상태 저장: Supabase (서버 환경 변수 전용)
- 읽기용 사실 데이터: `data/*.json` 더미 데이터
- 이미지 자산: `public/evidence/*`
- 데모 fallback: Supabase 환경 변수가 없으면 메모리 기반 데모 모드
- 심사 계약: 별도 API 키, DB 계정, 서비스 비밀값 없이 공개 URL로 확인 가능

## 왜 이렇게 바꿨는가
- Vercel 배포에서는 로컬 파일/브라우저 저장소만으로 여러 사용자가 공유하는 상태를 만들 수 없습니다.
- 이 프로젝트는 웹 링크 제출이 필요하므로, 서버리스 환경에 맞는 외부 저장소가 필요합니다.
- Next.js는 React 기반이면서 Vercel 배포, 동적 라우팅, 서버 렌더링, 시맨틱 페이지 구성에 가장 적합합니다.
- 해커톤 규칙상 외부 DB를 쓰더라도 심사자가 별도 키 없이 확인 가능해야 하므로, 비밀값은 운영자만 보관하고 심사자는 배포 URL만 사용하도록 정리합니다.

## 라우트
- `/`
  포털 개요, 대표 해커톤, 공유 상태 요약
- `/hackathons`
  해커톤 목록, 상태/태그 필터, 찜 토글, `scope=favorites|recruiting`
- `/hackathons/[slug]`
  시맨틱 상세 페이지, sticky 사이드바, 공유 팀 모집/문의, 제출 개요 저장
- `/camp`
  공유 팀 모집 보드, `status=open|closed`, `owner=me`, `hackathon=<slug>` 필터
- `/rankings`
  좌측 `전체 | 내 리더보드` 선택과 우측 기간 필터가 있는 전체 해커톤 순위 페이지 (`순위 / 닉네임 / points`)
- `/rankings/mine`
  내 공유 제출/내 리더보드 전용 페이지
- `/mypage`
  내 프로필, 찜한 해커톤, 내 팀 모집글, 내 제출 개요를 모아보는 페이지
- `/about`
  배포/저장 구조 안내

## Supabase에서 저장하는 데이터
- `auth_accounts`
  로그인 이메일과 비밀번호 해시
- `auth_sessions`
  서버가 검증하는 로그인 세션
- `profiles`
  사용자 닉네임과 공개 여부
- `hackathon_favorites`
  방문자별 찜 상태
- `camp_teams`
  공유 팀 모집글
- `team_messages`
  팀 모집글 문의 메시지
- `hackathon_submissions`
  제출 개요 상태

테이블 스키마 초안은 [docs/supabase-schema.sql](./docs/supabase-schema.sql)에 정리했습니다.

## 환경 변수
Vercel 또는 로컬 실행 시 아래 값이 필요합니다. 이 값들은 운영자 설정용이며, 심사자나 일반 사용자에게 공유하면 안 됩니다.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

`SUPABASE_URL`이 없으면 호환용으로 `NEXT_PUBLIC_SUPABASE_URL`도 읽습니다.  
둘 다 없거나 `SUPABASE_SERVICE_ROLE_KEY`가 없으면 앱은 읽기/시연용 메모리 모드로 동작합니다.  
이 모드는 **여러 사용자 간 영속 공유 상태가 아닙니다.**

현재 런타임 준비 상태와 빠진 변수명은 `/about` 페이지에서 바로 확인할 수 있습니다.

## 심사자 접근 방식
- 심사자는 공개 배포 URL만으로 메인, 목록, 상세, 캠프, 랭킹 화면을 확인할 수 있습니다.
- 별도 API 키, DB 비밀번호, 서비스 role key를 받을 필요가 없습니다.
- 쓰기 흐름 확인이 필요하면 앱 안의 일반 회원가입/로그인 화면으로 직접 계정을 만들 수 있습니다.
- 운영용 비밀값은 Vercel 환경 변수에만 두고, GitHub/README/PDF/발표 자료에는 넣지 않습니다.

## 로그인과 공개 범위
- 읽기 전용 공개 페이지는 로그인 없이 둘러볼 수 있습니다.
- 찜, 팀 모집글 작성/수정, 문의, 제출 저장은 로그인 후에만 가능합니다.
- 로그인과 회원가입은 전용 화면 `/login`, `/signup`에서 진행합니다.
- 프로필에서 로그인 이메일과 공개 연락 이메일을 분리해 관리할 수 있고, 공개 연락 이메일만 공용 팀 카드에 노출할 수 있습니다.
- 팀 문의 inbox와 내 제출 저장본은 소유자 본인만 볼 수 있도록 분리했습니다.

## 실행
```bash
npm install --cache /tmp/npm-cache
npm run dev
```

프로덕션 빌드 검증:

```bash
bash .ops/verify.sh
```

## Vercel 배포 순서
1. Supabase 프로젝트를 만든다.
2. [docs/supabase-schema.sql](./docs/supabase-schema.sql)을 실행해 테이블을 만든다.
3. Vercel 프로젝트에 저장소를 연결한다.
4. `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 Vercel 환경 변수로 넣는다.
5. 배포 후 공개 URL에서 메인/목록/상세/랭킹이 로그인 없이 열리는지 확인한다.
6. `/signup`, `/login`, `/camp`, `/mypage`에서 쓰기 흐름이 일반 사용자 기준으로 동작하는지 확인한다.
7. README, PDF, 발표 자료 어디에도 서비스 role key를 노출하지 않았는지 확인한다.

로컬 실행 시에도 같은 이름을 권장합니다. 기존 설정을 이미 쓰고 있다면 `NEXT_PUBLIC_SUPABASE_URL`은 계속 읽히지만, 서버 전용 `SUPABASE_URL`로 맞추는 편이 운영상 더 명확합니다.

## 참고 문서
- [docs/final-proposal.md](./docs/final-proposal.md)
- [docs/hackathon-overview.md](./docs/hackathon-overview.md)
- [docs/hackathon-rules-guidelines.md](./docs/hackathon-rules-guidelines.md)
- [docs/hackathon-evaluation.md](./docs/hackathon-evaluation.md)
- [docs/judge-preview-screen-spec.md](./docs/judge-preview-screen-spec.md)
- [docs/submission-solution-outline.md](./docs/submission-solution-outline.md)

## 참고
- 기존 `index.html`, `app.js`, `styles.css`, `server.js`는 정적 프로토타입 이력으로 남아 있습니다.
- 현재 제출용 실행 경로는 Next.js 앱입니다.
- 홈의 팀 찾기/랭킹 보기 카드 안쪽 요약 타일도 각각 실제 목적지로 연결됩니다.
