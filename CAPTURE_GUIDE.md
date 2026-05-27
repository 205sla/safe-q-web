# 📸 발표 백업용 캡처 가이드

발표장 Wi-Fi·CDN 장애에 대비한 fallback 슬라이드 이미지. **Apple 톤 적용 후** 라이브 사이트 (https://205sla.github.io/safe-q-web/) 에서 캡처해 PPT 슬라이드 [19][20][21] 의 fallback 자료로 사용.

## 필요한 캡처 10장 (필수)

| # | 파일명 (권장) | URL | 캡처 시점 | PPT 슬라이드 |
|---:|---|---|---|---|
| 1 | `apple/login.png` | `#/login` | 로딩 후 정적 화면 | [19] HCI ① 로그인 |
| 2 | `apple/login-error.png` | `#/login` | "네트워크 오류 시뮬" 버튼 클릭 후 | 백업 |
| 3 | `apple/home.png` | `#/home` | 로딩 후 정적 화면 | (백업) |
| 4 | `apple/scan-loading.png` | `#/scan?state=loading` | 로딩 인디케이터 표시 시점 | [20] 상태 ① |
| 5 | `apple/scan-safe.png` | `#/scan?risk=safe` | 결과 표시 시점 | [20] 상태 ② |
| 6 | `apple/scan-warning.png` | `#/scan?risk=warning` | 결과 표시 시점 | [20] 상태 ③ |
| 7 | `apple/scan-danger.png` | `#/scan?risk=danger` | 결과 표시 시점 | [20] 상태 ④ |
| 8 | `apple/scan-danger-confirm.png` | `#/scan?risk=danger` | "위험 감수" 클릭 → 다이얼로그 | 백업 |
| 9 | `apple/map.png` | `#/map` | 지도 + 8 마커 모두 보이는 줌 | [21] HCI ③ 지도 |
| 10 | `apple/map-detail.png` | `#/map` | 마커 1개 탭 → 상세 시트 열린 상태 | 백업 |

## 추가 권장 캡처 (선택)

| # | 파일명 | URL/동작 | 용도 |
|---:|---|---|---|
| 11 | `apple/scan-share-sheet.png` | `#/scan?risk=warning` → "공유" 탭 → 시트 열림 | 발표 시 그룹 공유 흐름 |
| 12 | `apple/scan-share-toast.png` | 공유 시트에서 "가족" 선택 후 | 토스트 노출 |
| 13 | `apple/scan-error.png` | `#/scan?state=error` | 오류 상태 |
| 14 | `apple/home-history-tap.png` | `#/home` → 최근 이력 아이템 탭 | 진입 흐름 |

## 캡처 방법

### Windows (권장)
1. **Edge / Chrome 개발자 도구** 열기 (F12)
2. 디바이스 툴바 토글 (Ctrl+Shift+M)
3. 디바이스 = **iPhone 14 Pro Max** (또는 393×852 픽셀)
4. URL 입력 후 화면 로딩 완료 대기 (1~2초)
5. 개발자 도구 우측 상단 ⋮ → **Capture screenshot**
6. 저장된 PNG 를 `screenshots/apple/` 폴더에 위 표 파일명으로 저장

### macOS
- Safari → 개발자 메뉴 → **Responsive Design Mode** → iPhone 선택
- Cmd+Shift+5 → 캡처

### 빠른 일괄 캡처 (개발자용)
Puppeteer/Playwright 스크립트로 자동화 가능. 필요 시 별도 작업.

## 디자이너 원본 캡처 (참고용)

zip 에 동봉된 `screenshots/` 폴더의 27 장은 **원본 민트 톤**입니다 (Apple 적용 전).
파일 분류:

| 파일 패턴 | 추정 내용 |
|---|---|
| `01-login.png` | 로그인 화면 |
| `0*-home.png` | 홈 화면 변형들 |
| `0*-scan.png`, `04-scan-safe.png` | 스캔 결과 변형들 |
| `0*-v5-map.png`, `v5-zone*.png` | 지도 화면 |
| `0*-tour.png` | 디자이너 투어 캡처 |
| `0*-v3.png`, `0*-v4.png`, `0*-r2.png` | 디자인 반복 단계 |

→ 발표용 자료로는 부적합. Apple 톤 캡처를 새로 떠 주세요.

## 발표용 PPT 삽입 가이드

- Slide [19] 로그인: `login.png` (배경 흰색이라 슬라이드 위에 그대로 얹기)
- Slide [20] QR 결과 ★: `scan-safe.png` + `scan-warning.png` + `scan-danger.png` 3장을 한 슬라이드에 가로 배치 (Apple 표지 스타일 분할)
- Slide [21] 지도: `map.png` 한 장 + `map-detail.png` 우측 작은 미니뷰
- 라이브 시연 시: PPT 자체는 백업으로만 두고, 브라우저로 직접 시연
