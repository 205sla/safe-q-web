// Map Risk-Zone screen — Leaflet + custom markers
// Filters by level / period. Current location marker. Detail sheet on tap.

const LEVELS = ['High', 'Medium', 'Low'];
const LEVEL_LABEL_KO = { High: '위험 높음', Medium: '주의', Low: '낮음' };
const LEVEL_LABEL_SHORT_KO = { High: '높음', Medium: '보통', Low: '낮음' };

const MapScreen = () => {
  const mapEl = React.useRef(null);
  const mapObj = React.useRef(null);
  const markerLayer = React.useRef(null);
  const userMarker = React.useRef(null);
  const [selected, setSelected] = React.useState(null);
  const [activeLevels, setActiveLevels] = React.useState(new Set(LEVELS));
  const [period, setPeriod] = React.useState('7d'); // '7d' | '30d'
  const [permissionDenied, setPermissionDenied] = React.useState(false);

  const { riskZones, currentLocation } = window.MOCK;

  // Period filter is decorative (mock data), but we vary report counts visually a bit.
  const zonesForPeriod = React.useMemo(() => {
    return riskZones.map(z => period === '30d' ? { ...z, reportCount: Math.round(z.reportCount * 2.4) } : z);
  }, [period]);

  const visibleZones = zonesForPeriod.filter(z => activeLevels.has(z.level));

  const toggleLevel = (lv) => {
    setActiveLevels(s => {
      const next = new Set(s);
      next.has(lv) ? next.delete(lv) : next.add(lv);
      // never empty
      return next.size === 0 ? new Set(LEVELS) : next;
    });
  };

  // ---- Init map once ----
  React.useEffect(() => {
    if (!window.L) return; // safety
    if (mapObj.current) return;
    const map = window.L.map(mapEl.current, {
      center: [currentLocation.lat, currentLocation.lng],
      zoom: 13,
      zoomControl: false,
      attributionControl: true,
    });
    // Use CartoDB Positron — light, low-contrast tiles
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap, © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 19, pane: 'overlayPane'
    }).addTo(map);

    mapObj.current = map;
    markerLayer.current = window.L.layerGroup().addTo(map);

    // User location marker
    const userIcon = window.L.divIcon({
      className: 'sq-marker',
      html: '<div class="map-marker current"><div class="map-marker-pulse"></div><div class="map-marker-dot"></div></div>',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
    userMarker.current = window.L.marker(
      [currentLocation.lat, currentLocation.lng],
      { icon: userIcon, interactive: false }
    ).addTo(map);

    return () => {
      map.remove();
      mapObj.current = null;
    };
  }, []);

  // ---- Sync markers when filters change ----
  React.useEffect(() => {
    if (!markerLayer.current) return;
    markerLayer.current.clearLayers();
    visibleZones.forEach(z => {
      const klass = z.level.toLowerCase();
      const icon = window.L.divIcon({
        className: 'sq-marker',
        html: `
          <div class="map-marker ${klass}">
            <div class="map-marker-pulse"></div>
            <div class="map-marker-dot"></div>
          </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
      const marker = window.L.marker([z.lat, z.lng], { icon }).addTo(markerLayer.current);
      marker.on('click', () => setSelected(z));
    });
  }, [visibleZones]);

  const recenter = () => {
    if (!mapObj.current) return;
    mapObj.current.flyTo([currentLocation.lat, currentLocation.lng], 13, { duration: 0.6 });
  };

  return (
    <div className="map-screen">
      <div className="page-header" style={{ borderBottom: '1px solid var(--border-1)' }}>
        <div>
          <div className="t-meta" style={{ color: 'var(--c205-mint-deep)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>RISK MAP</div>
          <h1>위험 지역</h1>
        </div>
        <div className="actions">
          <button
            className="icon-btn"
            onClick={() => { setPermissionDenied(p => !p); toast(permissionDenied ? '위치 권한 허용을 시뮬레이션해요' : '위치 권한 거부를 시뮬레이션해요'); }}
            title="위치 권한 시뮬"
          >
            <Icon name={permissionDenied ? 'pin-off' : 'pin'} size={18}/>
          </button>
          <button className="icon-btn" aria-label="설정"><Icon name="sliders" size={18}/></button>
        </div>
      </div>

      <div className="map-canvas">
        <div id="leaflet-map" ref={mapEl}/>

        <div className="map-top">
          <div className="map-search">
            <Icon name="search" size={16}/>
            <input placeholder="지역 또는 도메인 검색"/>
            <span className="live"><span className="led"/> LIVE</span>
          </div>
          <div className="map-filters">
            <button
              className={`filter-chip ${activeLevels.has('High') ? 'active' : ''}`}
              onClick={() => toggleLevel('High')}>
              <span className="dot high"/> 위험
            </button>
            <button
              className={`filter-chip ${activeLevels.has('Medium') ? 'active' : ''}`}
              onClick={() => toggleLevel('Medium')}>
              <span className="dot medium"/> 주의
            </button>
            <button
              className={`filter-chip ${activeLevels.has('Low') ? 'active' : ''}`}
              onClick={() => toggleLevel('Low')}>
              <span className="dot low"/> 낮음
            </button>
            <button
              className={`filter-chip ${period === '7d' ? 'active' : ''}`}
              onClick={() => setPeriod('7d')}>
              7일
            </button>
            <button
              className={`filter-chip ${period === '30d' ? 'active' : ''}`}
              onClick={() => setPeriod('30d')}>
              30일
            </button>
          </div>
        </div>

        {permissionDenied && (
          <div className="map-empty">
            <div className="icon-circle"><Icon name="pin-off" size={16} strokeWidth={2.2}/></div>
            <div>
              <strong>위치 권한이 필요해요</strong>
              <span className="small">권한이 허용되면 내 주변 위험 정보를 보여드려요.</span>
            </div>
          </div>
        )}

        {visibleZones.length === 0 && !permissionDenied && (
          <div className="map-empty">
            <div className="icon-circle" style={{ background: 'var(--c205-mint-soft)', color: 'var(--c205-mint-deep)' }}>
              <Icon name="info" size={16} strokeWidth={2.2}/>
            </div>
            <div>
              <strong>표시할 위험 정보가 없어요</strong>
              <span className="small">필터를 다시 조정해 보세요.</span>
            </div>
          </div>
        )}

        <button className="map-fab" onClick={recenter} aria-label="현재 위치">
          <Icon name="crosshair" size={20} strokeWidth={2.2}/>
        </button>

        <div className="map-counter">
          <span className="num">{visibleZones.length}</span>
          <span>곳 표시 중 · 최근 {period === '7d' ? '7일' : '30일'}</span>
        </div>

        {selected && (
          <ZoneSheet
            zone={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
};

const ZoneSheet = ({ zone, onClose }) => {
  const klass = zone.level.toLowerCase();
  return (
    <div className="zone-sheet">
      <div className="handle"/>
      <div className="head">
        <div className={`level-icon ${klass}`}>
          <Icon
            name={zone.level === 'High' ? 'alert-tri' : zone.level === 'Medium' ? 'shield-alert' : 'shield-check'}
            size={22} strokeWidth={2.2}
          />
        </div>
        <div className="info">
          <div className="name">{zone.name}</div>
          <div className="updated">{zone.updated} 업데이트 · {LEVEL_LABEL_KO[zone.level]}</div>
        </div>
        <button className="close" onClick={onClose}><Icon name="x" size={16}/></button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="label">신고 건수</div>
          <div className={`value ${zone.level === 'High' ? 'danger' : zone.level === 'Medium' ? 'warn' : 'success'}`}>
            {zone.reportCount}
          </div>
        </div>
        <div className="stat-card">
          <div className="label">위험 등급</div>
          <div className={`value ${zone.level === 'High' ? 'danger' : zone.level === 'Medium' ? 'warn' : 'success'}`}
               style={{ fontSize: 18, lineHeight: 1.3 }}>
            {LEVEL_LABEL_SHORT_KO[zone.level]}
          </div>
        </div>
      </div>

      <h5>대표 위험 URL</h5>
      {zone.urls.map((u, i) => (
        <div className="url-row" key={i}>
          <span className="url-text">{u}</span>
          <span className={`chip chip-${zone.level === 'High' ? 'danger' : zone.level === 'Medium' ? 'warn' : 'neutral'}`}>
            <span className="dot"/>
            {zone.level === 'High' ? '차단' : zone.level === 'Medium' ? '주의' : '관찰'}
          </span>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => toast('신고 화면은 데모 범위 밖이에요')}>
          <Icon name="flag" size={16}/> 위험 신고
        </button>
        <button className="btn btn-mint" style={{ flex: 1 }} onClick={onClose}>
          <Icon name="check" size={16} color="#fff" strokeWidth={2.2}/> 확인
        </button>
      </div>
    </div>
  );
};

window.MapScreen = MapScreen;
