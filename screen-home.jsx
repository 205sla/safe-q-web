// Home screen — Safe Q-Web
// Greeting, big QR-scan CTA, today's stats, recent history.

const HomeScreen = ({ user, onScan, onOpenResult, onLogout, onGoto }) => {
  const { stats, history } = window.MOCK;

  return (
    <div className="home">
      <div className="page-header">
        <div>
          <div className="t-meta" style={{ color: 'var(--c205-mint-deep)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>SAFE Q-WEB</div>
          <h1>홈</h1>
        </div>
        <div className="actions">
          <button className="icon-btn" aria-label="알림"><Icon name="bell" size={18} /></button>
          <button className="icon-btn" aria-label="로그아웃" onClick={onLogout}><Icon name="log-out" size={18} /></button>
        </div>
      </div>

      <div className="home-greet">
        <div className="hi">안녕하세요, {user?.username || 'test'} 님</div>
        <h2 style={{ textWrap: 'pretty' }}>오늘 스캔한 QR이 안전한지<br/>먼저 확인해 보세요</h2>
      </div>

      <div
        className="scan-cta"
        role="button"
        tabIndex={0}
        onClick={onScan}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onScan()}
      >
        <svg className="qr-frame" viewBox="0 0 100 100" fill="none">
          <path d="M5 25V15a10 10 0 0 1 10-10h10M75 5h10a10 10 0 0 1 10 10v10M95 75v10a10 10 0 0 1-10 10H75M25 95H15a10 10 0 0 1-10-10V75" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <div className="title">QR 스캔하기</div>
        <div className="sub">사이트에 들어가기 전 안전한지 먼저 확인해요.</div>
        <span className="pill">
          <Icon name="qr" size={14} color="#fff" strokeWidth={2.2} />
          탭하면 카메라가 켜져요
        </span>
      </div>

      <div className="stat-strip">
        <div className="stat">
          <div className="num">{stats.scanned}</div>
          <div className="label">이번 주 스캔</div>
        </div>
        <div className="stat danger">
          <div className="num">{stats.blocked}</div>
          <div className="label">차단 / 위험</div>
        </div>
        <div className="stat safe">
          <div className="num">{stats.shared}</div>
          <div className="label">그룹 공유</div>
        </div>
      </div>

      <button className="news-banner" onClick={() => onGoto('news')}>
        <div className="nb-icon"><Icon name="spark" size={20} color="#fff" strokeWidth={2.2} /></div>
        <div className="nb-text">
          <div className="nb-title">최근 피싱 소식</div>
          <div className="nb-sub">택배 사칭 큐싱 등 새 수법 {(window.MOCK.phishingNews || []).length}건</div>
        </div>
        <span className="nb-new">NEW</span>
        <Icon name="chevron-r" size={16} color="var(--fg-4)" />
      </button>

      <div className="section-head">
        <h3>최근 스캔 이력</h3>
        <button className="more" onClick={() => toast('이력 화면은 데모 범위 밖이에요')}>
          전체 보기 <Icon name="chevron-r" size={12} />
        </button>
      </div>
      <div className="history-list">
        {history.map((h, i) => (
          <div key={i} className="history-item" onClick={() => onOpenResult(h.level)}>
            <div className={`history-icon ${h.level.toLowerCase()}`}>
              {h.level === 'Safe' && <Icon name="shield-check" size={20} strokeWidth={2.2} />}
              {h.level === 'Warning' && <Icon name="shield-alert" size={20} strokeWidth={2.2} />}
              {h.level === 'Danger' && <Icon name="shield-alert" size={20} strokeWidth={2.2} />}
            </div>
            <div className="history-body">
              <div className="domain">{h.domain}</div>
              <div className="meta">
                <span className={`chip chip-${h.level === 'Safe' ? 'success' : h.level === 'Warning' ? 'warn' : 'danger'}`}
                      style={{ padding: '1px 6px', fontSize: 10 }}>
                  {h.level === 'Safe' ? '안전' : h.level === 'Warning' ? '주의' : '위험'}
                </span>
                <span style={{ marginLeft: 6 }}>{h.ago}</span>
              </div>
            </div>
            <Icon name="chevron-r" size={16} color="var(--fg-4)" />
          </div>
        ))}
      </div>
    </div>
  );
};

window.HomeScreen = HomeScreen;
