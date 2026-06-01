// 최근 피싱 소식 화면 (UC6) — Safe Q-Web
// PhishingTechnique 목록 + 카테고리 필터 + 상세 시트
// PhishingExample(실제 신고된 도메인) + 예방 팁 포함

const NewsScreen = ({ onBack }) => {
  const { phishingNews } = window.MOCK;
  const [cat, setCat] = React.useState('전체');
  const [openId, setOpenId] = React.useState(null);

  const cats = ['전체', ...Array.from(new Set(phishingNews.map(n => n.category)))];
  const list = cat === '전체' ? phishingNews : phishingNews.filter(n => n.category === cat);
  const detail = phishingNews.find(n => n.techniqueId === openId);

  const levelChip = (lv) =>
    lv === 'Danger' ? { cls: 'danger', txt: '위험' }
    : lv === 'Warning' ? { cls: 'warn', txt: '주의' }
    : { cls: 'success', txt: '안전' };

  return (
    <div className="news-screen">
      {/* 헤더 */}
      <div className="page-header">
        <div className="ph-left">
          <button className="icon-btn" aria-label="뒤로" onClick={onBack}>
            <Icon name="arrow-l" size={18} />
          </button>
          <div>
            <div className="t-meta" style={{ color: 'var(--c205-mint-deep)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>SAFE Q-WEB</div>
            <h1>최근 피싱 소식</h1>
          </div>
        </div>
      </div>

      <div className="news-intro">
        최근 유행하는 큐싱·피싱 수법을 미리 알아두면 피해를 예방할 수 있어요.
      </div>

      {/* 카테고리 필터 */}
      <div className="cat-chips">
        {cats.map(c => (
          <button key={c} className={`cat-chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* 기법 카드 목록 */}
      <div className="news-list">
        {list.map(n => {
          const lc = levelChip(n.level);
          return (
            <button key={n.techniqueId} className="news-card" onClick={() => setOpenId(n.techniqueId)}>
              <div className="nc-top">
                <span className={`chip chip-${lc.cls}`} style={{ padding: '2px 8px', fontSize: 11 }}>{lc.txt}</span>
                <span className="nc-cat">{n.category}</span>
                <span className="nc-ago">{n.ago}</span>
              </div>
              <div className="nc-title">{n.name}</div>
              <div className="nc-summary">{n.summary}</div>
              <div className="nc-foot">
                <Icon name="flag" size={12} color="var(--fg-3)" />
                <span>신고 사례 {n.examples.length}건</span>
                <Icon name="chevron-r" size={14} color="var(--fg-4)" style={{ marginLeft: 'auto' }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* 인앱 광고 — 미니샵 (목록 하단 보조 배너) */}
      <div className="inapp-ad inapp-ad--mini">
        <span className="inapp-ad__label">AD · 제휴</span>
        <div className="inapp-ad__frame">
          <iframe
            src="ad.html"
            title="제휴 광고"
            scrolling="no"
            frameBorder="0"
            loading="lazy"
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
          />
        </div>
      </div>

      {/* 상세 시트 */}
      {detail && (
        <div className="modal-backdrop" onClick={() => setOpenId(null)}>
          <div className="modal news-detail" onClick={e => e.stopPropagation()}>
            <div className="handle" />
            <div className="nd-head">
              {(() => { const lc = levelChip(detail.level); return (
                <span className={`chip chip-${lc.cls}`} style={{ padding: '2px 10px', fontSize: 12 }}>{lc.txt}</span>
              ); })()}
              <span className="nd-cat">{detail.category}</span>
              <span className="nd-date">등록 {detail.registeredAt}</span>
            </div>
            <h3 className="nd-title">{detail.name}</h3>
            <p className="nd-desc">{detail.description}</p>

            <div className="nd-section-label"><Icon name="shield-check" size={14} color="var(--c205-mint-deep)" /> 예방 수칙</div>
            <ul className="nd-tips">
              {detail.tips.map((t, i) => (
                <li key={i}><Icon name="check" size={14} color="var(--c205-mint-deep)" strokeWidth={2.4} /><span>{t}</span></li>
              ))}
            </ul>

            <div className="nd-section-label"><Icon name="flag" size={14} color="var(--color-danger)" /> 최근 신고된 사례</div>
            <div className="nd-examples">
              {detail.examples.map((ex, i) => (
                <div key={i} className="nd-ex">
                  <Icon name="globe" size={14} color="var(--fg-3)" />
                  <span className="ex-url">{ex.url}</span>
                  <span className="ex-ago">{ex.addedAt}</span>
                </div>
              ))}
            </div>

            <button className="btn btn-mint btn-block btn-lg" style={{ marginTop: 14 }}
                    onClick={() => { setOpenId(null); setTimeout(() => toast('가족 그룹에 소식을 공유했어요', 'success'), 80); }}>
              <Icon name="share" size={16} color="#fff" strokeWidth={2.2} /> 그룹에 소식 공유
            </button>
            <button className="btn btn-ghost btn-block" style={{ marginTop: 4 }} onClick={() => setOpenId(null)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

window.NewsScreen = NewsScreen;
