// Safe Q-Web — mock data (no backend, all in-memory)
// Exposed on window so all script files can read.

window.MOCK = {
  users: [
    { userId: "u001", username: "test", email: "test@safeqweb.kr",
      passwordHash: "1234", otpEnabled: false, registeredAt: "2025-03-12",
      displayName: "김안전", phone: "010-1234-5678", plan: "무료" }
  ],

  // 내 정보 — 프로필
  profile: {
    displayName: "김안전",
    username: "test",
    email: "test@safeqweb.kr",
    phone: "010-1234-5678",
    registeredAt: "2025-03-12",
    plan: "무료",
    otpEnabled: false,
    notifyDanger: true,
    notifyGroup: true,
    stats: { scanned: 47, blocked: 6, shared: 14 }
  },

  // 내가 속한 그룹 (멤버 상세 포함)
  myGroups: [
    {
      groupId: "g01", name: "가족", icon: "users", role: "관리자",
      members: [
        { name: "김안전", role: "관리자", me: true },
        { name: "김보호", role: "멤버" },
        { name: "이안심", role: "멤버" },
        { name: "박지킴", role: "멤버" }
      ],
      pending: [{ email: "grandpa@example.com", sentAt: "2일 전" }]
    },
    {
      groupId: "g03", name: "친한 친구들", icon: "heart", role: "멤버",
      members: [
        { name: "최우정", role: "관리자" },
        { name: "김안전", role: "멤버", me: true },
        { name: "정의리", role: "멤버" }
      ],
      pending: []
    },
    {
      groupId: "g04", name: "엔트리 동아리", icon: "code", role: "멤버",
      members: [
        { name: "이영호", role: "관리자" },
        { name: "김안전", role: "멤버", me: true }
      ],
      pending: []
    }
  ],

  // Three canonical scan results — one per risk level.
  // riskLevel: "Safe" | "Warning" | "Danger"
  scanResults: {
    Safe: {
      qrId: "q-safe-001",
      url: "https://shop.goodbrand.co.kr/promo/202605",
      domain: "shop.goodbrand.co.kr",
      riskLevel: "Safe",
      riskScore: 12,
      confidence: 0.96,
      analyzedAt: "방금 전",
      preview: {
        title: "굿브랜드 5월 프로모션 — 정상 페이지",
        description: "구매 안전이 확인된 공식 쇼핑몰의 5월 프로모션 이벤트 페이지예요. HTTPS 인증서가 유효하고 도메인이 6년 이상 운영된 곳이에요.",
        bg: "linear-gradient(135deg,#E5F7F4 0%,#FFEFF5 100%)",
        accent: "#2E8F87",
        emoji: "🛍️"
      },
      reasons: [
        { kind: "safe", text: "최근 30일간 모두 정상으로 분류됐어요." },
        { kind: "safe", text: "도메인 등록 기간이 6년 이상이에요." },
        { kind: "safe", text: "캐시된 분석 결과와 일치해요." },
        { kind: "neutral", text: "HTTPS 인증서가 유효한 상태예요." }
      ]
    },
    Warning: {
      qrId: "q-warn-001",
      url: "https://unknown-shop.io/event?ref=qr",
      domain: "unknown-shop.io",
      riskLevel: "Warning",
      riskScore: 58,
      confidence: 0.71,
      analyzedAt: "방금 전",
      preview: {
        title: "신규 도메인 — 추가 분석이 필요해요",
        description: "최근에 등록된 도메인이고 트래픽이 적어서 정상 여부를 확정하기 어려워요. 사이트로 이동하기 전 한 번 더 확인해 주세요.",
        bg: "linear-gradient(135deg,#FFF6DC 0%,#FFEFF5 100%)",
        accent: "#8A6800",
        emoji: "⚠️"
      },
      reasons: [
        { kind: "warn", text: "도메인 등록 7일 미만 — 신규 도메인이에요." },
        { kind: "warn", text: "분석 신뢰도가 71%로 낮은 편이에요." },
        { kind: "neutral", text: "블랙리스트에는 등록되어 있지 않아요." },
        { kind: "warn", text: "유사 도메인 2건이 최근 신고됐어요." }
      ]
    },
    Danger: {
      qrId: "q-dgr-001",
      url: "http://malicious-site.xyz/kb-login/secure?step=2",
      domain: "malicious-site.xyz",
      riskLevel: "Danger",
      riskScore: 92,
      confidence: 0.94,
      analyzedAt: "방금 전",
      preview: {
        title: "은행 사칭 의심 — 로그인 정보 요구 페이지",
        description: "정상 은행을 사칭해 로그인 정보를 빼내려는 페이지로 보여요. 절대 개인정보를 입력하지 마세요.",
        bg: "linear-gradient(135deg,#FFE8E8 0%,#6E7378 100%)",
        accent: "#A62020",
        emoji: "🚨",
        blocked: true
      },
      reasons: [
        { kind: "danger", text: "블랙리스트에 등록된 도메인이에요.", strong: true },
        { kind: "danger", text: "최근 7일 내 신고가 12건 접수됐어요." },
        { kind: "danger", text: "은행 로그인 페이지를 사칭하고 있어요." },
        { kind: "warn", text: "HTTPS 인증서가 없는 http 사이트예요." }
      ]
    }
  },

  // Recent history shown on home
  history: [
    { domain: "shop.goodbrand.co.kr", level: "Safe", ago: "2분 전" },
    { domain: "malicious-site.xyz", level: "Danger", ago: "12분 전" },
    { domain: "unknown-shop.io", level: "Warning", ago: "1시간 전" },
    { domain: "blog.naver.com", level: "Safe", ago: "어제" },
    { domain: "phish-bank.cf", level: "Danger", ago: "2일 전" }
  ],

  // Stats shown on home
  stats: {
    scanned: 47,
    blocked: 6,
    shared: 14
  },

  // Groups for share modal
  groups: [
    { groupId: "g01", name: "가족", count: 4, icon: "users" },
    { groupId: "g02", name: "회사 보안팀", count: 12, icon: "shield" },
    { groupId: "g03", name: "친한 친구들", count: 8, icon: "heart" },
    { groupId: "g04", name: "엔트리 동아리", count: 23, icon: "code" }
  ],

  // Risk zones for map screen (around Seoul, real-ish coordinates)
  riskZones: [
    { zoneId: "z01", lat: 37.4979, lng: 127.0276, level: "High",   reportCount: 23, name: "강남역 일대",      updated: "5분 전",
      urls: ["malicious-site.xyz", "phish-kb.cf", "lotte-fake.shop"] },
    { zoneId: "z02", lat: 37.5547, lng: 126.9707, level: "Medium", reportCount: 8,  name: "서울역 주변",      updated: "32분 전",
      urls: ["unknown-shop.io", "ticket-event.click"] },
    { zoneId: "z03", lat: 37.5172, lng: 127.0473, level: "High",   reportCount: 17, name: "선릉역 일대",      updated: "1시간 전",
      urls: ["fake-kakao.xyz", "naver-login.cf"] },
    { zoneId: "z04", lat: 37.5663, lng: 126.9779, level: "Low",    reportCount: 2,  name: "광화문 광장",      updated: "어제",
      urls: ["promo-shop.io"] },
    { zoneId: "z05", lat: 37.5400, lng: 127.0700, level: "Medium", reportCount: 6,  name: "건대입구역",       updated: "2시간 전",
      urls: ["event-cgv.click", "music-fest.shop"] },
    { zoneId: "z06", lat: 37.5050, lng: 127.0240, level: "Low",    reportCount: 3,  name: "양재시민의숲",     updated: "어제",
      urls: ["promo-bbq.io"] },
    { zoneId: "z07", lat: 37.5326, lng: 126.9905, level: "Medium", reportCount: 9,  name: "용산역 일대",      updated: "12분 전",
      urls: ["delivery-cj.cf", "ktx-refund.shop"] },
    { zoneId: "z08", lat: 37.4837, lng: 126.9006, level: "High",   reportCount: 14, name: "사당역 환승구간",  updated: "8분 전",
      urls: ["bus-fake.xyz", "samsung-prize.cf"] }
  ],
  currentLocation: { lat: 37.5012, lng: 127.0396, name: "역삼동" }
};
