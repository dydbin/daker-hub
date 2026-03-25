# Daker Hub

Daker Hub는 해커톤 탐색, 팀 모집, 랭킹, Judge Preview를 한 흐름으로 묶은 공개 해커톤 포털입니다.

- 서비스 URL: `https://daker-hub-psi.vercel.app`
- GitHub 저장소: `https://github.com/dydbin/daker-hub`

## 소개

Daker Hub는 사용자가 "어떤 해커톤에 참가할까?"에서 시작해 팀을 찾고, 참가를 결정하고, 제출 전 준비 상태를 점검하는 과정까지 한 서비스 안에서 이어서 처리할 수 있게 만든 웹 포털입니다.

핵심 흐름은 다음과 같습니다.

- 해커톤 목록 탐색과 상세 정보 확인
- 팀 모집글 탐색, 작성, 문의
- 개인 참가와 팀 보드 관리
- 제출 개요 저장과 Judge Preview 자가 점검
- 랭킹과 내 활동 확인

## 주요 기능

- 상태와 맥락이 보이는 해커톤 목록 및 상세 페이지
- 전체/해커톤별 팀 모집 보드와 작성자 전용 팀 보드
- 로그인 기반 찜, 문의, 제출 저장 흐름
- 저장한 제출 내용을 다시 점검할 수 있는 Judge Preview
- 랭킹과 마이페이지 기반 활동 확인

## 기술 스택

- Next.js App Router
- React
- Supabase
- Vercel

## 로컬 실행

```bash
npm install --cache /tmp/npm-cache
npm run dev
```

로컬에서 인증과 저장 기능까지 모두 확인하려면 서버 환경 변수가 필요합니다. 해당 설정이 없으면 일부 기능은 제한된 데모 모드로 동작할 수 있습니다.

검증 명령:

```bash
bash .ops/verify.sh
```

## 참고

- 실제 제출 대상 앱은 `app/`, `components/`, `lib/`, `public/` 기준의 Next.js 애플리케이션입니다.
- 일부 정적 프로토타입 파일은 이력 보존용으로 함께 남아 있습니다.
