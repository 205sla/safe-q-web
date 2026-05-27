// Login screen — Safe Q-Web
// Mock auth: id=test / pw=1234. 5 failures → lock. Auto-login via localStorage.

const LoginScreen = ({ onLogin, onGoto }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [error, setError] = React.useState(null);  // {kind, msg, sub}
  const [failCount, setFailCount] = React.useState(0);
  const [locked, setLocked] = React.useState(false);
  const [networkFail, setNetworkFail] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e && e.preventDefault();
    setError(null);
    if (locked) return;
    if (!username || !password) {
      setError({ kind: 'err', msg: '아이디와 비밀번호를 모두 입력해 주세요.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (networkFail) {
        setError({
          kind: 'err',
          msg: '네트워크에 연결할 수 없어요.',
          sub: 'Wi-Fi 또는 데이터를 확인하고 다시 시도해 주세요.'
        });
        return;
      }
      const u = window.MOCK.users.find(x => x.username === username || x.email === username);
      if (u && u.passwordHash === password) {
        if (remember) {
          try { localStorage.setItem('safeq.session', JSON.stringify({ userId: u.userId, ts: Date.now() })); } catch {}
        }
        onLogin(u);
      } else {
        const nf = failCount + 1;
        setFailCount(nf);
        if (nf >= 5) {
          setLocked(true);
          setError({
            kind: 'err',
            msg: '5회 연속 실패로 계정이 잠겼어요.',
            sub: '비밀번호 찾기로 재설정해 주세요.'
          });
        } else {
          setError({
            kind: 'err',
            msg: '아이디 또는 비밀번호가 올바르지 않아요.',
            sub: `${nf}/5회 시도 — 5회 실패 시 일시 잠금돼요.`
          });
        }
      }
    }, 600);
  };

  return (
    <div className="login">
      <div className="login-brand">
        <div className="login-mark">
          <div className="login-mark-icon">
            <Icon name="shield-check" size={22} color="#fff" strokeWidth={2.2} />
          </div>
          <div className="login-mark-text">Safe <span className="q">Q</span>-Web</div>
        </div>
        <div className="login-headline">
          QR을 찍기 전,<br/>
          <span className="accent">미리 안전하게</span>
        </div>
        <div className="login-sub">
          링크에 직접 들어가지 않고도 위험을 먼저 확인해요. 그룹에 공유하면 가족과 동료를 함께 지킬 수 있어요.
        </div>
      </div>

      {error && (
        <div className="login-error">
          <Icon name="alert-tri" size={16} />
          <div>
            {error.msg}
            {error.sub && <span className="small">{error.sub}</span>}
          </div>
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field-label" htmlFor="lg-id">아이디 또는 이메일</label>
          <div className="input-with-icon">
            <input
              id="lg-id"
              className="input"
              type="text"
              autoComplete="username"
              placeholder="test"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={locked}
            />
            <span className="icon"><Icon name="user" size={18} /></span>
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="lg-pw">비밀번호</label>
          <div className="input-with-icon" style={{ position: 'relative' }}>
            <input
              id="lg-pw"
              className="input"
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={locked}
              style={{ paddingRight: 44 }}
            />
            <span className="icon"><Icon name="lock" size={18} /></span>
            <button
              type="button"
              onClick={() => setShowPw(s => !s)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)',
                padding: 6
              }}
              aria-label="비밀번호 표시"
            >
              <Icon name={showPw ? 'eye-off' : 'eye'} size={18} />
            </button>
          </div>
        </div>

        <div className="login-options">
          <label className="checkbox">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            <span className="box"><Icon name="check" size={12} color="#fff" strokeWidth={3} /></span>
            <span>자동 로그인</span>
          </label>
          <button type="button" className="link-tiny" onClick={() => onGoto('forgot')}>
            비밀번호를 잊었나요?
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-mint btn-block btn-lg"
          disabled={locked || loading}
        >
          {loading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
                animation: 'spin 0.7s linear infinite'
              }} />
              확인 중…
            </span>
          ) : (
            <>로그인 <Icon name="arrow-r" size={18} color="#fff" strokeWidth={2.2}/></>
          )}
        </button>

        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ flex: 1, fontSize: 11, padding: '8px 6px' }}
            onClick={() => { setNetworkFail(f => !f); setError(null); }}
          >
            <Icon name="wifi-off" size={13} /> 네트워크 오류 시뮬{networkFail ? ' · ON' : ''}
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ flex: 1, fontSize: 11, padding: '8px 6px' }}
            onClick={() => { setFailCount(0); setLocked(false); setError(null); }}
          >
            <Icon name="refresh" size={13} /> 잠금 해제
          </button>
        </div>

        <div className="demo-helper">
          데모 계정 — <b>test</b> / <b>1234</b>
        </div>
      </form>

      <div className="login-foot">
        Safe Q-Web 이 처음이신가요? <button onClick={() => onGoto('signup')}>회원가입</button>
      </div>
    </div>
  );
};

window.LoginScreen = LoginScreen;
