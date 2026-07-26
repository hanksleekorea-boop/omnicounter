# OmniCounter — 고정(불변) 배포

이 폴더의 목적: **URL은 영구히 고정, 내용만 갱신**되는 링크를 만드는 것.
한 번만 아래 중 한 방법으로 연결하면, 이후 버전 업데이트는 `index.html`만 교체하면
같은 주소로 최신이 반영됩니다(매번 새 netlify 드롭 = 새 주소 문제 해소).

현재 담긴 버전: **v22.3** (sha256 8348840b4822a215…). version.json에 기록.

## ⚠️ 이 저장소의 실제 배포 브랜치 = `gh-pages` (main 아님)
2026-07-26 실측으로 확인됨. 이 문서의 이전 판은 Pages 소스를 `main / (root)`로 잘못 적고 있었고,
그 기재만 믿고 main에만 커밋했을 때 **라이브는 전혀 바뀌지 않았다**(D-1).
- 배포 = `gh-pages` 브랜치에 커밋해야 반영된다.
- 배포 성공 판정은 문서나 화면이 아니라 **공개 응답의 sha256**으로 한다.
  (`git ls-remote`로 브랜치 헤드 변화 확인 → 공개 URL 응답 해시를 후보와 대조)

## 방법 A — GitHub Pages (현재 운영 방식)
1. 저장소: `github.com/hanksleekorea-boop/omnicounter` (Public).
2. Settings → Pages → Source = **`gh-pages` / (root)**.
3. 고정 URL: `https://hanksleekorea-boop.github.io/omnicounter/`
- 업데이트: `gh-pages` 브랜치에 새 index.html 커밋 → 같은 URL 자동 최신(약 1분).
- 자격증명 없이 배포하는 경로: GitHub 웹 UI의 `Upload files` 폼
  (`/upload/gh-pages`)에 파일을 넣고 **Commit directly to the gh-pages branch** 선택.
  토큰을 저장할 필요가 없다(DIR-19).

## 방법 B — Netlify 클레임(계정에 귀속 · 드래그로 갱신)
1. 지금 쓰던 netlify drop 사이트를 계정에 **Claim**(무료) → 사이트가 영구 보존됨.
2. Site settings에서 서브도메인 rename(예: `omnicounter.netlify.app`) → 이게 고정 URL.
3. 업데이트: 그 사이트의 Deploys에 이 폴더를 드래그 → **같은 URL** 유지(새 주소 안 생김).
   (또는 방법 A의 GitHub 저장소를 연결하면 푸시=자동 배포로 드래그도 불필요)

## 구성
- index.html : 앱(현재 버전)
- tally.html / habit.html / days-since.html : 용도별 영어 랜딩(앱 딥링크로 직결)
- 404.html : 해시 라우팅 대비 — **index.html로 넘기는 리다이렉트만** 담는다.
  (v22.3 이전에는 앱 전체 사본이 들어 있어, 404 경로 사용자가 배포본과 다른 버전을 받았다 — D-2)
- version.json : 현재 버전·해시
- _redirects : netlify용 짧은 경로(선택)
