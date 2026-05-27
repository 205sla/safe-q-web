// Safe Q-Web — main app shell with route + tab nav
// Supports ?screen=home|scan|map and ?risk=safe|warning|danger via URL hash/query

const parseHash = () => {
  // accept ?screen=foo&risk=bar OR #/scan?risk=danger
  const h = window.location.hash || '';
  const qIdx = h.indexOf('?');
  const params = new URLSearchParams(qIdx >= 0 ? h.slice(qIdx + 1) : window.location.search.slice(1));
  let screen = params.get('screen');
  if (!screen && h.startsWith('#/')) {
    screen = h.slice(2).split('?')[0];
  }
  return {
    screen: screen || null,
    risk: (params.get('risk') || '').toLowerCase(),
    state: (params.get('state') || '').toLowerCase()
  };
};

const App = () => {
  const [user, setUser] = React.useState(() => {
    try {
      const raw = localStorage.getItem('safeq.session');
      if (!raw) return null;
      const s = JSON.parse(raw);
      return window.MOCK.users.find(u => u.userId === s.userId) || null;
    } catch { return null; }
  });

  // Route state
  const [route, setRoute] = React.useState(() => {
    const p = parseHash();
    return {
      screen: p.screen || (user ? 'home' : 'login'),
      risk: ['safe','warning','danger'].includes(p.risk)
        ? p.risk.charAt(0).toUpperCase() + p.risk.slice(1)
        : 'Safe',
      scanState: ['loading','result','invalid','error'].includes(p.state) ? p.state : 'result'
    };
  });

  // Honor ?screen= on first load even when not logged in (helps demo)
  React.useEffect(() => {
    const p = parseHash();
    if (p.screen && p.screen !== 'login' && !user) {
      // Auto-login as test user for demo if a deep-link target is given
      const u = window.MOCK.users[0];
      setUser(u);
    }
    // Sync risk
    if (p.risk && p.risk !== route.risk.toLowerCase()) {
      setRoute(r => ({ ...r, risk: p.risk.charAt(0).toUpperCase() + p.risk.slice(1) }));
    }
  }, []);

  // Hash change listener
  React.useEffect(() => {
    const onHash = () => {
      const p = parseHash();
      setRoute(r => ({
        ...r,
        ...(p.screen ? { screen: p.screen } : {}),
        ...(p.risk && ['safe','warning','danger'].includes(p.risk) ? { risk: p.risk.charAt(0).toUpperCase() + p.risk.slice(1) } : {}),
        ...(p.state && ['loading','result','invalid','error'].includes(p.state) ? { scanState: p.state } : {})
      }));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Cross-screen events
  React.useEffect(() => {
    const onGoMap = () => setRoute(r => ({ ...r, screen: 'map' }));
    window.addEventListener('safe-q:gotomap', onGoMap);
    return () => window.removeEventListener('safe-q:gotomap', onGoMap);
  }, []);

  const goto = (screen) => setRoute(r => ({ ...r, screen }));

  const handleLogin = (u) => {
    setUser(u);
    setRoute({ screen: 'home', risk: 'Safe', scanState: 'result' });
  };
  const handleLogout = () => {
    try { localStorage.removeItem('safeq.session'); } catch {}
    setUser(null);
    setRoute({ screen: 'login', risk: 'Safe', scanState: 'result' });
  };
  const handleScan = () => {
    setRoute(r => ({ ...r, screen: 'scan', scanState: 'loading' }));
  };
  const handleOpenResult = (level) => {
    setRoute(r => ({ ...r, screen: 'scan', risk: level, scanState: 'result' }));
  };

  // 외부 카메라 아이콘 → 카메라 시뮬레이션 화면으로
  const handleOpenCamera = () => {
    // 비로그인 상태면 자동 로그인 (시연용)
    if (!user && window.MOCK?.users?.[0]) setUser(window.MOCK.users[0]);
    setRoute(r => ({ ...r, screen: 'camera' }));
  };
  // 카메라에서 QR 인식 → 우리 앱의 스캔 분석 화면으로 (Danger 로 극적 효과)
  const handleCameraQR = () => {
    setRoute(r => ({ ...r, screen: 'scan', scanState: 'loading', risk: 'Danger' }));
  };

  const showTabs = user && ['home', 'scan', 'map'].includes(route.screen);
  const isCameraView = route.screen === 'camera';

  return (
    <>
    <div className={`phone ${isCameraView ? 'is-camera' : ''}`}>
      <div className="dynamic-island"/>
      <div className="status-bar">
        <span>9:41</span>
        <div className="right" style={{ fontSize: 13 }}>
          <span style={{ fontSize: 12 }}>···</span>
          <span style={{ fontSize: 12 }}>5G</span>
          <span className="battery"><span className="battery-fill"/></span>
        </div>
      </div>

      <div className="screen">
        {route.screen === 'login' && (
          <LoginScreen onLogin={handleLogin} onGoto={(t) => {
            if (t === 'signup') setRoute(r => ({ ...r, screen: 'signup' }));
            else if (t === 'forgot') setRoute(r => ({ ...r, screen: 'forgot' }));
          }}/>
        )}
        {route.screen === 'signup' && (
          <PlaceholderPage
            title="회원가입"
            heading="회원가입"
            body="회원가입 흐름은 데모 범위 밖이에요. 발표에서는 본 화면을 라우팅이 동작하는 자리표시자로 사용해 주세요."
            onBack={() => setRoute(r => ({ ...r, screen: 'login' }))}
          />
        )}
        {route.screen === 'forgot' && (
          <PlaceholderPage
            title="비밀번호 찾기"
            heading="비밀번호 재설정"
            body="등록된 이메일로 재설정 링크를 보내드려요. 데모에서는 라우팅만 표시해요."
            onBack={() => setRoute(r => ({ ...r, screen: 'login' }))}
          />
        )}
        {route.screen === 'home' && user && (
          <HomeScreen
            user={user}
            onScan={handleScan}
            onOpenResult={handleOpenResult}
            onLogout={handleLogout}
            onGoto={goto}
          />
        )}
        {route.screen === 'scan' && user && (
          <ScanScreen
            initialState={route.scanState}
            initialRisk={route.risk}
            onClose={() => setRoute(r => ({ ...r, screen: 'home' }))}
          />
        )}
        {route.screen === 'map' && user && (
          <MapScreen/>
        )}
        {route.screen === 'camera' && (
          <CameraScreen
            detectUrl="safe-q-web.app/scan"
            onDetected={handleCameraQR}
            onClose={() => setRoute(r => ({ ...r, screen: user ? 'home' : 'login' }))}
          />
        )}
        {route.screen === 'profile' && user && (
          <PlaceholderPage
            title="내 정보"
            heading={`${user.username} 님`}
            body="계정 설정, 알림, 그룹 관리, 차단 목록 등이 들어가는 자리예요."
            onBack={() => setRoute(r => ({ ...r, screen: 'home' }))}
          />
        )}
      </div>

      {showTabs && (
        <div className="tabbar">
          <button className={`tab ${route.screen === 'home' ? 'active' : ''}`} onClick={() => goto('home')}>
            <Icon name="home" size={22} strokeWidth={route.screen === 'home' ? 2.2 : 1.8}/>
            <span>홈</span>
          </button>
          <button className={`tab ${route.screen === 'scan' ? 'active' : ''}`}
                  onClick={() => setRoute(r => ({ ...r, screen: 'scan', scanState: 'result' }))}>
            <Icon name="qr" size={22} strokeWidth={route.screen === 'scan' ? 2.2 : 1.8}/>
            <span>스캔 결과</span>
          </button>
          <button className={`tab ${route.screen === 'map' ? 'active' : ''}`} onClick={() => goto('map')}>
            <Icon name="map" size={22} strokeWidth={route.screen === 'map' ? 2.2 : 1.8}/>
            <span>위험 지도</span>
          </button>
          <button className={`tab ${route.screen === 'profile' ? 'active' : ''}`} onClick={() => goto('profile')}>
            <Icon name="user" size={22} strokeWidth={route.screen === 'profile' ? 2.2 : 1.8}/>
            <span>내 정보</span>
          </button>
        </div>
      )}

      <ToastHost/>
    </div>

    {/* 폰 외부 — iOS 홈스크린 스타일 카메라 앱 아이콘 (시연용) */}
    <CameraAppIcon onOpen={handleOpenCamera} active={isCameraView}/>
    </>
  );
};

const CameraAppIcon = ({ onOpen, active }) => (
  <div className="ios-app-icon-stage">
    <button
      className={`ios-app-icon ios-app-icon-camera ${active ? 'is-active' : ''}`}
      onClick={onOpen}
      title="카메라 (시연용) — 클릭하면 폰에서 카메라 앱이 열립니다"
      aria-label="카메라 시연 열기"
    >
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.5 4l1.7 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.8L9.5 4h5z"/>
        <circle cx="12" cy="13" r="3.8"/>
      </svg>
    </button>
    <span className="ios-app-icon-label">카메라</span>
    <span className="ios-app-icon-hint">시연용 · 클릭하면 폰이 카메라로 전환됩니다</span>
  </div>
);

const PlaceholderPage = ({ title, heading, body, onBack }) => (
  <div className="placeholder">
    <div className="ph-header">
      <button className="ph-back" onClick={onBack}><Icon name="arrow-l" size={18}/></button>
      <h2>{title}</h2>
    </div>
    <div className="ph-body">
      <div className="ph-icon"><Icon name="sparkles" size={36} strokeWidth={2.2}/></div>
      <h3>{heading}</h3>
      <p>{body}</p>
      <button className="btn btn-mint-soft" onClick={onBack} style={{ marginTop: 6 }}>
        <Icon name="arrow-l" size={16}/> 돌아가기
      </button>
    </div>
  </div>
);

window.App = App;

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
