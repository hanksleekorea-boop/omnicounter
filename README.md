# OmniCounter — 고정(불변) 링크 배포

목적: **URL은 영구 고정, 내용만 갱신**되는 링크. 한 번만 올리면 이후 새 버전은
index.html 교체 push로 같은 주소에 최신 반영(매번 새 netlify 주소 문제 소멸).
현재 담긴 버전: v21 (sha256 4c5ce3a4bd08c274…). version.json 참조.

## ★ 가장 쉬운 방법 — deploy.bat 더블클릭(자동)
1. github.com/settings/tokens/new → classic 토큰, 권한 **repo** 하나만 체크, Generate.
   (이 토큰은 이 스크립트에서만 쓰이고 채팅에 노출되지 않습니다. 끝나면 폐기 권장.)
2. 이 폴더의 **deploy.bat** 더블클릭 → 토큰 붙여넣고 Enter.
3. 저장소 생성 → 업로드 → Pages 활성화까지 자동. 끝에 나오는
   `https://<아이디>.github.io/omnicounter/` 주소를 채팅에 붙여넣으면 됩니다.
- 업데이트: 새 index.html로 교체 후 deploy.bat 다시 실행(또는 그 폴더에서 git push).

## 방법 B — GitHub Desktop(GUI, git 명령 불필요)
1. 이 폴더를 Add → Publish repository(Public, 이름 omnicounter).
2. github.com 저장소 → Settings → Pages → main / (root) → Save.
3. 1분 뒤 `https://<아이디>.github.io/omnicounter/`.

## 방법 C — Netlify 클레임(git 없이)
기존 netlify drop 사이트를 계정에 Claim → 서브도메인 rename → 그 사이트에 이 폴더
드래그(같은 URL 유지).

## 구성
index.html=앱(v21) · tally/habit/days-since.html=영어 랜딩(앱 딥링크 직결) ·
404.html=해시 라우팅 폴백 · version.json=버전·해시 · _redirects=netlify 짧은 경로 ·
deploy.ps1/deploy.bat=자동 배포 스크립트.
