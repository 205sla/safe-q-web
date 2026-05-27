# Safe Q-Web — 모바일 데모 앱

QR / URL 피싱 탐지 및 공유 서비스의 발표용 프로토타입. 백엔드 없이 mock 데이터만으로 동작.

> **소프트웨어공학** 최종 발표용 라이브 데모입니다. 7분 발표 중 약 60초 분량을 위해 만들어졌습니다.

## 🌐 라이브 데모

**👉 https://205sla.github.io/safe-q-web/**

GitHub Pages 로 호스팅되어 발표 중 어떤 브라우저에서든 접속 가능합니다.

## 👥 팀원

| 이름 | 학번 |
|---|---|
| 권승원 | 2022105666 |
| 김영윤 | 2021105582 |
| 서준수 | 2022110209 |
| 이영호 | 2022105483 |

---

## ⚡ 빠른 실행

| 방법 | 명령 |
|---|---|
| 라이브 데모 | https://205sla.github.io/safe-q-web/ (브라우저 접속) |
| 로컬 실행 | `index.html` 더블 클릭 |
| 로컬 정적 서버 | `python -m http.server 8080` 후 http://localhost:8080 |

> 폰트·Leaflet 타일은 CDN 에서 가져오므로 **인터넷 연결 필요** (최초 1회).

---

## 🎬 7분 발표 시연 시나리오

### 핵심 흐름 (약 50초)

| 순서 | 화면 | 동작 | 발표 멘트 (요지) |
|---:|---|---|---|
| 1 | 로그인 | `test / 1234` 로 로그인 *(아이디 자동 채움)* | "앱 진입은 OTP 옵션을 포함한 로그인입니다" |
| 2 | 홈 | 큰 민트 카드 "**QR 스캔하기**" 탭 | "메인 액션은 QR 스캔" |
| 3 | 스캔 결과 (Safe) | 상단 **DEMO 세그먼트 컨트롤** 클릭 → Safe / Warning / Danger 순차 전환 | "위험도는 3등급, 시각 강도로 차등 표시" |
| 4 | Danger 상태 | "위험 감수" 탭 → 확인 다이얼로그 | "위험 시 한 단계 더 확인" |
| 5 | "공유" 탭 | 그룹 선택 시트 → 가족 선택 → 토스트 | "그룹에 즉시 공유, 가족 보호" |
| 6 | 위험 지도 (탭바) | 마커 탭 → 상세 시트 | "주변 위험 지역 시각화" |

### 백업 / 보조

- "**네트워크 오류 시뮬**" 버튼 — 로그인 화면 오류 상태 시연
- "**잠금 해제**" 버튼 — 계정 잠금 복구
- 지도 헤더 **핀 아이콘** — 위치 권한 거부 상태 시뮬
- 자동 로그인 = `localStorage('safeq.session')`

---

## 🔗 발표용 핫키 (URL 해시)

발표 중 주소창에 입력하면 한 번에 원하는 화면으로 점프합니다. 비로그인 상태에서 진입해도 **데모 계정 자동 로그인**됩니다.

| 화면 | 해시 |
|---|---|
| 홈 | `#/home` |
| 스캔 결과 — 안전 | `#/scan?risk=safe` |
| 스캔 결과 — 주의 | `#/scan?risk=warning` |
| 스캔 결과 — 위험 | `#/scan?risk=danger` |
| 스캔 — 로딩 | `#/scan?state=loading` |
| 스캔 — 오류 | `#/scan?state=error` |
| 위험 지도 | `#/map` |
| 로그인 | `#/login` |

**예**: 발표 중 위험 화면을 즉시 보여주려면 → `https://205sla.github.io/safe-q-web/#/scan?risk=danger`

---

## 🗺 화면 구성

### ① 로그인 (`screen-login.jsx`)
- 데모 계정: `test / 1234`
- 아이디 자동 채움 + 자동 로그인 (`localStorage`)
- 보조 버튼: 네트워크 오류 시뮬 / 잠금 해제
- 회원가입·비밀번호 찾기는 placeholder (라우팅만)

### ② 홈 (`screen-home.jsx`)
- 큰 민트 CTA "QR 스캔하기"
- 사용자 통계 (스캔 횟수, 차단 수)
- 최근 이력 (탭하면 해당 결과로 진입)

### ③ QR 스캔 결과 (`screen-scan.jsx`) — **핵심**
- 5 가지 상태: **로딩 · 안전 · 주의 · 위험 · 오류**
- 위험도 3 단계 시각 차등 표시
- 위험 시: "사이트로" 차단 + "위험 감수" 확인 다이얼로그
- 액션: 공유 (그룹 선택 시트) · 신고 (토스트) · 이력 자동 저장
- 미리보기: 사이트 타이틀 + 메타 description + 분석 근거

### ④ 위험 지도 (`screen-map.jsx`)
- Leaflet + CartoDB Positron 타일
- 서울 주변 **8 개 위험 지점**
- 등급별 색상 마커 (High / Medium / Low)
- 필터칩 (등급 / 기간) · 재중심 FAB · 위치 권한 시뮬

---

## 📁 파일 구성

```
index.html             # 진입점 — React + Leaflet 로딩
styles.css             # 앱 전용 스타일
colors_and_type.css    # 디자인 토큰 (205 / 엔트리 포트폴리오 시스템)
mock-data.js           # 모든 mock 데이터 (사용자, 스캔 결과, 그룹, 위험 지역)
icons.jsx              # Lucide 스타일 SVG 아이콘 + 토스트 호스트
screen-login.jsx       # ① 로그인 / 회원가입·비밀번호 찾기 라우팅
screen-home.jsx        # ② 홈 — 스캔 CTA + 통계 + 최근 이력
screen-scan.jsx        # ③ QR 스캔 결과 (★) — 5 상태 + 위험도 3 단계
screen-map.jsx         # ④ 위험 지도 — Leaflet + 마커 + 상세 시트
app.jsx                # 라우터 + 폰 프레임 + 탭바
tweaks-panel.jsx       # 디자인 튜닝용 패널 (개발자만)
fonts/                 # OTF 폰트 (Maplestory, OK Mallang 등)
assets/                # 로고 (직접 노출 안 함, 리소스 보존용)
screenshots/           # 발표 백업용 캡처
```

---

## 🎨 디자인 시스템

- **컬러**: 민트 (`--c205-mint`) 메인 / 핑크 (`--c205-pink`) 액센트 / 무드 그레이 (`--c205-bg-mood`) 분위기
- **헤드라인**: Maplestory
- **본문**: Pretendard Variable
- **위험 점수**: OK Mallang (둥근 숫자)
- **URL**: D2Coding (모노스페이스)

원전: 이영호 / 205 포트폴리오 디자인 시스템

---

## 🧯 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| 첫 로딩이 1~2초 느림 | Babel standalone 이 JSX 를 브라우저에서 변환. 정상 동작. |
| 지도 타일이 안 보임 | 인터넷 연결 또는 CartoDB Positron 일시 장애. 새로고침. |
| 폰트가 시스템 폰트로 보임 | OTF 가 캐시되기 전. 새로고침. |
| 로그아웃해도 자동 로그인됨 | `localStorage.removeItem('safeq.session')` (개발자 콘솔) |
| 발표장 Wi-Fi 끊김 | 캡처 백업 (`screenshots/`) 으로 fallback |

---

## ⚠️ 알려진 한계

- 실제 카메라·GPS 미사용 — 모두 mock 시뮬레이션
- 회원가입·비밀번호 찾기·내 정보·알림은 라우팅만 동작하는 placeholder
- Leaflet 지도는 CartoDB Positron 타일 — 모바일 네트워크에서 첫 로드만 느림
- 백엔드 API 호출 없음 (모든 데이터는 `mock-data.js` 안)
