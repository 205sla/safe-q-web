// QR Scan Result screen — the core screen
// States: loading | result | invalid | error | external
// Risk levels: Safe / Warning / Danger — toggled via segmented control

const RISK_LABELS = {
  Safe: '안전해요',
  Warning: '주의하세요',
  Danger: '위험해요'
};
const RISK_TAGLINES = {
  Safe: '검증된 도메인이에요. 안심하고 진행해도 좋아요.',
  Warning: '아직 정보가 부족해요. 한 번 더 확인해 주세요.',
  Danger: '강한 위험 신호가 감지됐어요. 사이트로 이동하지 마세요.'
};

// Animated circular ring around the score
const RiskRing = ({ score, level }) => {
  const r = 52;
  const c = 2 * Math.PI * r;
  // map score to 0..1 — for Safe we visually show "100 - score" (more = safer)?
  // Simpler: ring fills with the actual risk score so it's intuitive
  // (Safe → small fill, Danger → almost full).
  const pct = Math.min(Math.max(score / 100, 0), 1);
  const [drawn, setDrawn] = React.useState(0);
  React.useEffect(() => {
    setDrawn(0);
    const t = setTimeout(() => setDrawn(pct), 60);
    return () => clearTimeout(t);
  }, [score, level]);
  return (
    <svg className="ring" width="120" height="120" viewBox="0 0 120 120">
      <circle className="bg" cx="60" cy="60" r={r} />
      <circle
        className="fg"
        cx="60" cy="60" r={r}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - drawn)}
        style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      />
    </svg>
  );
};

const RiskHero = ({ data }) => {
  const lvl = data.riskLevel.toLowerCase();
  const iconName =
    data.riskLevel === 'Safe' ? 'shield-check' :
    data.riskLevel === 'Warning' ? 'shield-alert' :
    'shield-alert';
  return (
    <div className={`risk-hero ${lvl}`}>
      <div className="risk-shield">
        <RiskRing score={data.riskScore} level={data.riskLevel} />
        <div className="center">
          <Icon name={iconName} className="icon" strokeWidth={2.2} size={32}/>
          <div className="score">{data.riskScore}</div>
          <div className="score-label">RISK</div>
        </div>
      </div>
      <div className="risk-level">{RISK_LABELS[data.riskLevel]}</div>
      <div className="risk-tagline">{RISK_TAGLINES[data.riskLevel]}</div>
      <div className="confidence-row">
        <Icon name="sparkles" size={11} /> 신뢰도 {Math.round(data.confidence * 100)}% · {data.analyzedAt}
      </div>
    </div>
  );
};

// Mock preview thumbnail using SVG + brand gradient placeholder
const PreviewThumb = ({ data }) => (
  <div
    className="image"
    style={{ background: data.preview.bg }}
  >
    {data.preview.blocked && (
      <div className="lock">
        <Icon name="lock" size={28} color="#fff" strokeWidth={2.2} />
        <span>미리보기 차단됨</span>
      </div>
    )}
    {!data.preview.blocked && (
      <div style={{
        position:'absolute', inset:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:42, opacity:0.55
      }}>
        <span style={{ filter:'grayscale(0.0)' }}>{data.preview.emoji}</span>
      </div>
    )}
  </div>
);

// ============================================================
// Group share modal
// ============================================================
const ShareModal = ({ onClose, url }) => {
  const [selected, setSelected] = React.useState(null);
  const { groups } = window.MOCK;
  const handleShare = () => {
    const g = groups.find(x => x.groupId === selected);
    onClose();
    setTimeout(() => toast(`${g.name} 그룹에 공유했어요`, 'success'), 80);
  };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="handle"/>
        <h3 style={{ fontSize: 18, marginBottom: 4 }}>위험 정보를 공유할 그룹</h3>
        <p style={{ fontSize: 13, color: 'var(--fg-3)' }}>
          선택한 그룹의 멤버들이 동일한 QR을 스캔할 때 빠르게 경고를 받아요.
        </p>
        <div className="group-list">
          {groups.map(g => (
            <div
              key={g.groupId}
              className={`group-row ${selected === g.groupId ? 'selected' : ''}`}
              onClick={() => setSelected(g.groupId)}
            >
              <div className="g-icon">
                <Icon name={g.icon} size={18} strokeWidth={2.2} />
              </div>
              <div className="name">{g.name}</div>
              <div className="count">{g.count}명</div>
              <div className="check"><Icon name="check" size={18} strokeWidth={2.4}/></div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-mint btn-block btn-lg"
          disabled={!selected}
          onClick={handleShare}
          style={{ marginTop: 8 }}
        >
          <Icon name="share" size={16} color="#fff" strokeWidth={2.2}/> 선택한 그룹에 공유
        </button>
        <button
          className="btn btn-ghost btn-block"
          onClick={onClose}
          style={{ marginTop: 4 }}
        >
          취소
        </button>
      </div>
    </div>
  );
};

// ============================================================
// Confirm dialog (used before opening Danger URL)
// ============================================================
const ConfirmDialog = ({ onClose, onConfirm, domain }) => (
  <div className="modal-backdrop center" onClick={onClose}>
    <div className="modal dialog" onClick={e => e.stopPropagation()}>
      <div style={{
        width: 56, height: 56, borderRadius: 18,
        background: 'var(--color-danger-soft)',
        color: 'var(--color-danger)',
        margin: '0 auto 12px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon name="alert-tri" size={28} strokeWidth={2.2} />
      </div>
      <h3 style={{ textAlign: 'center', fontSize: 18, marginBottom: 6 }}>정말 이동할까요?</h3>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.55 }}>
        <strong style={{ color: 'var(--fg-1)' }}>{domain}</strong> 는 강한 위험 신호가 있어요.
        은행이나 카드 정보, 개인정보를 절대 입력하지 마세요.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
        <button className="btn btn-outline btn-block" onClick={onClose}>
          <Icon name="x" size={16} /> 취소하고 돌아가기
        </button>
        <button className="btn btn-danger btn-block" onClick={onConfirm}
                style={{ fontSize: 13, opacity: 0.85 }}>
          위험 감수하고 이동
        </button>
      </div>
    </div>
  </div>
);

// ============================================================
// Loading state — fake 1.5s analysis
// ============================================================
const ScanLoading = ({ url, onDone }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="scan-loading">
      <div className="scan-line">
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 8, opacity: 0.25 }}>
          <rect x="8" y="8" width="20" height="20"/><rect x="72" y="8" width="20" height="20"/>
          <rect x="8" y="72" width="20" height="20"/>
          <rect x="48" y="48" width="12" height="12"/><rect x="68" y="48" width="8" height="8"/>
          <rect x="48" y="68" width="8" height="8"/>
        </svg>
      </div>
      <h3>QR을 분석하고 있어요</h3>
      <p>도메인 평판과 캐시된 결과를 함께 확인 중이에요.</p>
      <div className="url-tag">{url}</div>
    </div>
  );
};

// Invalid QR state
const InvalidState = ({ onRetry, onCancel }) => (
  <div className="scan-error">
    <div className="icon-circle" style={{ background: 'var(--color-warning-soft)', color: '#8A6800' }}>
      <Icon name="qr" size={32} strokeWidth={2.2} />
    </div>
    <h3>QR 코드를 읽을 수 없어요</h3>
    <p>코드가 가려져 있거나 손상된 것 같아요. 다시 한번 카메라에 맞춰 주세요.</p>
    <div className="row">
      <button className="btn btn-outline" onClick={onCancel}>닫기</button>
      <button className="btn btn-mint" onClick={onRetry}>
        <Icon name="refresh" size={16} color="#fff" strokeWidth={2.2}/> 다시 시도
      </button>
    </div>
  </div>
);

// Error state — network
const ErrorState = ({ onRetry, onCancel }) => (
  <div className="scan-error">
    <div className="icon-circle">
      <Icon name="wifi-off" size={32} strokeWidth={2.2} />
    </div>
    <h3>분석에 실패했어요</h3>
    <p>네트워크 상태를 확인하고 다시 시도해 주세요. 캐시된 결과가 있는 경우엔 우선 표시해요.</p>
    <div className="row">
      <button className="btn btn-outline" onClick={onCancel}>닫기</button>
      <button className="btn btn-mint" onClick={onRetry}>
        <Icon name="refresh" size={16} color="#fff" strokeWidth={2.2}/> 재시도
      </button>
    </div>
  </div>
);

// External-link mock page (when user does open Danger URL)
const ExternalMock = ({ url, onBack }) => (
  <div className="ext-page">
    <div style={{
      width: 80, height: 80, borderRadius: 24,
      background: 'rgba(255,255,255,0.08)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: '#FF9D9D'
    }}>
      <Icon name="external" size={36} strokeWidth={2.2}/>
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>
      외부 사이트로 이동
    </div>
    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 280, margin: 0 }}>
      데모용 화면이에요. 실제 환경에서는 새 탭으로 외부 사이트가 열려요.
    </p>
    <div className="url-pill">{url}</div>
    <button className="btn btn-mint" onClick={onBack} style={{ marginTop: 8 }}>
      <Icon name="arrow-l" size={16} color="#fff" strokeWidth={2.2}/> Safe Q-Web 로 돌아가기
    </button>
  </div>
);

// ============================================================
// Main scan screen
// ============================================================
const ScanScreen = ({ initialState = 'result', initialRisk = 'Safe', onClose }) => {
  // demoState: result | loading | invalid | error | external
  const [state, setState] = React.useState(initialState);
  const [risk, setRisk] = React.useState(initialRisk);
  const [showShare, setShowShare] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  React.useEffect(() => { setRisk(initialRisk); }, [initialRisk]);
  React.useEffect(() => { setState(initialState); }, [initialState]);

  const data = window.MOCK.scanResults[risk];

  const handleOpenSite = () => {
    if (risk === 'Danger') { setShowConfirm(true); return; }
    setState('external');
  };
  const handleReport = () => toast('블랙리스트로 신고했어요. 감사합니다!', 'success');
  const handleCopy = () => toast('URL을 복사했어요');

  const stateButtons = (
    <div className="demo-bar">
      <div className="demo-bar-label">
        <span className="led"/> DEMO · 결과 상태 빠른 전환
      </div>
      <div className="segment">
        <button className={`seg-btn ${state==='loading'?'active':''}`} onClick={() => setState('loading')}>로딩</button>
        <button className={`seg-btn safe ${state==='result' && risk==='Safe'?'active':''}`}
                onClick={() => { setState('result'); setRisk('Safe'); }}>안전</button>
        <button className={`seg-btn warn ${state==='result' && risk==='Warning'?'active':''}`}
                onClick={() => { setState('result'); setRisk('Warning'); }}>주의</button>
        <button className={`seg-btn danger ${state==='result' && risk==='Danger'?'active':''}`}
                onClick={() => { setState('result'); setRisk('Danger'); }}>위험</button>
        <button className={`seg-btn ${state==='invalid' || state==='error'?'active':''}`}
                onClick={() => setState(state==='invalid' ? 'error' : 'invalid')}>오류</button>
      </div>
    </div>
  );

  // ====== render body by state ======
  let body;
  if (state === 'loading') {
    body = <ScanLoading url={data.url} onDone={() => setState('result')} />;
  } else if (state === 'invalid') {
    body = <InvalidState onCancel={onClose} onRetry={() => setState('loading')} />;
  } else if (state === 'error') {
    body = <ErrorState onCancel={onClose} onRetry={() => setState('loading')} />;
  } else if (state === 'external') {
    body = <ExternalMock url={data.url} onBack={() => setState('result')} />;
  } else {
    // result
    body = (
      <>
        <RiskHero data={data} />

        <div className="url-card">
          <div className="domain-row">
            <Icon name="globe" size={18} color="var(--fg-2)" strokeWidth={2.2}/>
            <div className="domain">{data.domain}</div>
            <span className={`chip chip-${risk === 'Safe' ? 'success' : risk === 'Warning' ? 'warn' : 'danger'}`}>
              <span className="dot"/>
              {risk === 'Safe' ? '안전' : risk === 'Warning' ? '주의' : '위험'}
            </span>
          </div>
          <div className="full-url">{data.url}</div>
          <div className="meta">
            <span>분석 {data.analyzedAt}</span>
            <button className="copy" onClick={handleCopy}>
              <Icon name="copy" size={12}/> URL 복사
            </button>
          </div>
        </div>

        <div className="preview-card">
          <PreviewThumb data={data} />
          <div className="body">
            <div className="title">{data.preview.title}</div>
            <div className="desc">{data.preview.description}</div>
          </div>
        </div>

        <div className="section">
          <h4>분석 근거</h4>
          <div className="reason-list">
            {data.reasons.map((r, i) => (
              <div key={i} className={`reason-row ${r.kind}`}>
                <span className="bullet">{i+1}</span>
                <span className="text">
                  {r.strong ? <strong>{r.text}</strong> : r.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h4>이 지역 위험도</h4>
          <div style={{
            background: 'var(--bg-1)', border: '1px solid var(--border-1)',
            borderRadius: 'var(--radius-lg)', padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
            cursor: 'pointer'
          }}
          onClick={() => { window.dispatchEvent(new CustomEvent('safe-q:gotomap')); }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: risk === 'Danger' ? 'var(--color-danger-soft)' :
                         risk === 'Warning' ? 'var(--color-warning-soft)' :
                         'var(--color-success-soft)',
              color: risk === 'Danger' ? 'var(--color-danger)' :
                     risk === 'Warning' ? '#8A6800' :
                     '#0F7A52',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon name="pin" size={18} strokeWidth={2.2}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>역삼동 일대</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                반경 1km 내 신고 {risk === 'Danger' ? 23 : risk === 'Warning' ? 5 : 2}건 · {risk === 'Danger' ? '높음' : risk === 'Warning' ? '보통' : '낮음'}
              </div>
            </div>
            <Icon name="chevron-r" size={16} color="var(--fg-4)"/>
          </div>
        </div>

        <div style={{ height: 12 }}/>
      </>
    );
  }

  // ====== action bar (only on result state) ======
  const actions = state === 'result' && (
    <div className="scan-actions">
      <button className="btn btn-outline" onClick={() => { setShowShare(true); }}>
        <Icon name="share" size={16}/> 공유
      </button>
      <button className="btn btn-outline" onClick={handleReport}>
        <Icon name="flag" size={16}/> 신고
      </button>
      {risk === 'Danger' ? (
        <button className="btn btn-danger" onClick={handleOpenSite}
                style={{ fontSize: 12 }}>
          <Icon name="external" size={14} color="#fff" strokeWidth={2.2}/> 위험 감수
        </button>
      ) : (
        <button
          className={risk === 'Warning' ? 'btn btn-outline' : 'btn btn-mint'}
          onClick={handleOpenSite}
        >
          <Icon name="external" size={16}
                color={risk === 'Warning' ? 'currentColor' : '#fff'}
                strokeWidth={2.2}/> 사이트로 이동
        </button>
      )}
    </div>
  );

  return (
    <div className="scan">
      <div className="page-header">
        <button className="icon-btn" onClick={onClose} aria-label="닫기"><Icon name="x" size={18}/></button>
        <h1>QR 스캔 결과</h1>
        <button className="icon-btn" aria-label="저장"><Icon name="bookmark" size={18}/></button>
      </div>

      {stateButtons}

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }} className="scan-scroll">
        {body}
      </div>

      {actions}

      {showShare && <ShareModal url={data.url} onClose={() => setShowShare(false)} />}
      {showConfirm && (
        <ConfirmDialog
          domain={data.domain}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => { setShowConfirm(false); setState('external'); }}
        />
      )}
    </div>
  );
};

window.ScanScreen = ScanScreen;
