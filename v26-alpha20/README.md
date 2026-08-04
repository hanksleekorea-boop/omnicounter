# v26.0-alpha.9 원격 연결 준비 계약

이 폴더는 특정 백엔드 업체에 종속되지 않는 설정 계약과 세 계정 RLS 읽기 검사기를 담는다.
현재 공개 앱은 `v26.0-alpha.8`이며, alpha9는 미배포 후보다.

## 안전 경계

- 실제 서버 설정이 없으면 결과는 `BLOCKED`, 종료 코드는 `2`다.
- `service-role`, 관리자 키, 서버 비밀키가 `WEDOIT_*` 환경변수에 들어오면 요청 전에 차단한다.
- 결과 JSON에는 공개키 값과 세 계정 토큰을 직렬화하지 않는다.
- 검사기는 읽기 전용 `GET /v1/goals/:id`만 호출한다.
- `PASS` 전에는 `actualBackend`, `remoteAccount` 성공을 주장하지 않는다.

## 필요한 API 계약

백엔드는 `Authorization: Bearer <test token>`과 `x-wedoit-publishable-key`를 받아
`GET /v1/goals/:id`에 `200`, `403`, 또는 존재 은닉용 `404`로 응답해야 한다.

세 테스트 계정은 소유자(owner), 활성 서클 회원(member), 비회원(stranger)이다.
fixture는 소유자의 비공개·서클·공개 목표 각 하나다.

## 실행

`backend.env.example`의 이름만 참고해 값을 정상 비밀 저장소나 현재 프로세스 환경에 주입한다.
값을 이 파일이나 저장소에 적지 않는다.

```powershell
node 70_TOOLS/remote_rls_probe_v260a9.mjs
```

검증 결과는 `PASS`, `FAIL`, `BLOCKED` 중 하나다. `BLOCKED`는 실패를 숨기는 성공이 아니라,
실제 서버 선택 또는 자격증명이 아직 없다는 명시적 차단 상태다.

