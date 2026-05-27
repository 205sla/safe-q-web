// Safe Q-Web — iOS 카메라 시연 화면
// 폰 외부의 카메라 앱 아이콘을 누르면 등장. ~1.5초 후 QR 인식 시뮬레이션.
// 노란 칩 클릭 시 onDetected() 호출 → 우리 앱의 스캔 분석 화면으로 전환.

const CameraScreen = ({ onDetected, onClose, detectUrl = 'safe-q-web.app/scan', delay = 1400 }) => {
  const [detected, setDetected] = React.useState(false);
  const [pulse, setPulse] = React.useState(false);

  React.useEffect(() => {
    const t1 = setTimeout(() => setDetected(true), delay);
    const t2 = setTimeout(() => setPulse(true), delay + 200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [delay]);

  return (
    <div className="ios-camera-screen">
      {/* 닫기 */}
      <button className="ios-cam-close" onClick={onClose} aria-label="카메라 닫기">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* 상단 컨트롤 (플래시 / 그리드) */}
      <div className="ios-cam-top">
        <button className="ios-cam-pill" aria-label="플래시">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span className="ios-cam-flash-a">A</span>
        </button>
        <button className="ios-cam-pill" aria-label="더보기">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="8" r="1.5"/><circle cx="12" cy="8" r="1.5"/><circle cx="19" cy="8" r="1.5"/>
            <circle cx="5" cy="14" r="1.5"/><circle cx="12" cy="14" r="1.5"/><circle cx="19" cy="14" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* 뷰파인더 */}
      <div className="ios-cam-viewfinder">
        <div className={`ios-cam-qr-wrap ${detected ? 'is-detected' : ''}`}>
          {/* SVG로 그린 QR-스러운 패턴 (실제 인코딩 X, 시각만) */}
          <svg className="ios-cam-qr-svg" viewBox="0 0 25 25" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <rect width="25" height="25" fill="#fff"/>
            {/* 좌상 finder */}
            <g fill="#000">
              <rect x="0" y="0" width="7" height="1"/>
              <rect x="0" y="6" width="7" height="1"/>
              <rect x="0" y="0" width="1" height="7"/>
              <rect x="6" y="0" width="1" height="7"/>
              <rect x="2" y="2" width="3" height="3"/>
            </g>
            {/* 우상 finder */}
            <g fill="#000">
              <rect x="18" y="0" width="7" height="1"/>
              <rect x="18" y="6" width="7" height="1"/>
              <rect x="18" y="0" width="1" height="7"/>
              <rect x="24" y="0" width="1" height="7"/>
              <rect x="20" y="2" width="3" height="3"/>
            </g>
            {/* 좌하 finder */}
            <g fill="#000">
              <rect x="0" y="18" width="7" height="1"/>
              <rect x="0" y="24" width="7" height="1"/>
              <rect x="0" y="18" width="1" height="7"/>
              <rect x="6" y="18" width="1" height="7"/>
              <rect x="2" y="20" width="3" height="3"/>
            </g>
            {/* 정렬 패턴 (작은) */}
            <g fill="#000">
              <rect x="17" y="17" width="5" height="1"/>
              <rect x="17" y="21" width="5" height="1"/>
              <rect x="17" y="17" width="1" height="5"/>
              <rect x="21" y="17" width="1" height="5"/>
              <rect x="19" y="19" width="1" height="1"/>
            </g>
            {/* 무작위 데이터 모듈 (의사 QR) */}
            <g fill="#000">
              {/* 위쪽 영역 */}
              <rect x="8"  y="0" width="1" height="1"/><rect x="10" y="0" width="2" height="1"/><rect x="13" y="0" width="1" height="1"/><rect x="15" y="0" width="1" height="1"/>
              <rect x="9"  y="1" width="1" height="1"/><rect x="11" y="1" width="1" height="1"/><rect x="14" y="1" width="2" height="1"/>
              <rect x="8"  y="2" width="2" height="1"/><rect x="11" y="2" width="2" height="1"/><rect x="15" y="2" width="1" height="1"/>
              <rect x="10" y="3" width="1" height="1"/><rect x="12" y="3" width="1" height="1"/><rect x="14" y="3" width="1" height="1"/><rect x="16" y="3" width="1" height="1"/>
              <rect x="8"  y="4" width="1" height="1"/><rect x="11" y="4" width="3" height="1"/><rect x="15" y="4" width="2" height="1"/>
              <rect x="9"  y="5" width="2" height="1"/><rect x="12" y="5" width="1" height="1"/><rect x="14" y="5" width="1" height="1"/>
              <rect x="8"  y="6" width="1" height="1"/><rect x="10" y="6" width="1" height="1"/><rect x="13" y="6" width="2" height="1"/>
              {/* 중간 영역 */}
              <rect x="0"  y="8"  width="1" height="1"/><rect x="2" y="8" width="1" height="1"/><rect x="5" y="8" width="2" height="1"/><rect x="8" y="8" width="1" height="1"/><rect x="11" y="8" width="2" height="1"/><rect x="14" y="8" width="1" height="1"/><rect x="17" y="8" width="1" height="1"/><rect x="20" y="8" width="2" height="1"/><rect x="23" y="8" width="2" height="1"/>
              <rect x="1"  y="9"  width="1" height="1"/><rect x="3" y="9" width="2" height="1"/><rect x="7" y="9" width="1" height="1"/><rect x="10" y="9" width="1" height="1"/><rect x="13" y="9" width="3" height="1"/><rect x="18" y="9" width="2" height="1"/><rect x="22" y="9" width="1" height="1"/>
              <rect x="0"  y="10" width="2" height="1"/><rect x="4" y="10" width="1" height="1"/><rect x="6" y="10" width="2" height="1"/><rect x="9" y="10" width="2" height="1"/><rect x="12" y="10" width="1" height="1"/><rect x="14" y="10" width="2" height="1"/><rect x="17" y="10" width="3" height="1"/><rect x="21" y="10" width="1" height="1"/><rect x="23" y="10" width="1" height="1"/>
              <rect x="2"  y="11" width="2" height="1"/><rect x="5" y="11" width="1" height="1"/><rect x="8" y="11" width="2" height="1"/><rect x="11" y="11" width="1" height="1"/><rect x="13" y="11" width="1" height="1"/><rect x="16" y="11" width="2" height="1"/><rect x="19" y="11" width="2" height="1"/><rect x="22" y="11" width="2" height="1"/>
              <rect x="0"  y="12" width="1" height="1"/><rect x="3" y="12" width="2" height="1"/><rect x="6" y="12" width="1" height="1"/><rect x="9" y="12" width="1" height="1"/><rect x="12" y="12" width="3" height="1"/><rect x="16" y="12" width="1" height="1"/><rect x="18" y="12" width="2" height="1"/><rect x="22" y="12" width="1" height="1"/><rect x="24" y="12" width="1" height="1"/>
              <rect x="1"  y="13" width="2" height="1"/><rect x="4" y="13" width="1" height="1"/><rect x="7" y="13" width="2" height="1"/><rect x="10" y="13" width="2" height="1"/><rect x="13" y="13" width="1" height="1"/><rect x="15" y="13" width="2" height="1"/><rect x="20" y="13" width="1" height="1"/><rect x="23" y="13" width="2" height="1"/>
              <rect x="0"  y="14" width="1" height="1"/><rect x="2" y="14" width="3" height="1"/><rect x="6" y="14" width="1" height="1"/><rect x="9" y="14" width="2" height="1"/><rect x="12" y="14" width="2" height="1"/><rect x="16" y="14" width="2" height="1"/><rect x="19" y="14" width="1" height="1"/><rect x="21" y="14" width="2" height="1"/>
              <rect x="3"  y="15" width="1" height="1"/><rect x="5" y="15" width="2" height="1"/><rect x="8" y="15" width="1" height="1"/><rect x="11" y="15" width="1" height="1"/><rect x="14" y="15" width="3" height="1"/><rect x="18" y="15" width="1" height="1"/><rect x="20" y="15" width="2" height="1"/><rect x="23" y="15" width="1" height="1"/>
              <rect x="0"  y="16" width="2" height="1"/><rect x="4" y="16" width="1" height="1"/><rect x="7" y="16" width="1" height="1"/><rect x="9" y="16" width="2" height="1"/><rect x="12" y="16" width="1" height="1"/><rect x="14" y="16" width="1" height="1"/><rect x="16" y="16" width="2" height="1"/><rect x="19" y="16" width="1" height="1"/><rect x="22" y="16" width="3" height="1"/>
              {/* 하단 영역 */}
              <rect x="8"  y="18" width="1" height="1"/><rect x="10" y="18" width="2" height="1"/><rect x="13" y="18" width="1" height="1"/><rect x="15" y="18" width="1" height="1"/><rect x="23" y="18" width="2" height="1"/>
              <rect x="9"  y="19" width="2" height="1"/><rect x="12" y="19" width="1" height="1"/><rect x="14" y="19" width="2" height="1"/><rect x="22" y="19" width="1" height="1"/>
              <rect x="8"  y="20" width="2" height="1"/><rect x="11" y="20" width="1" height="1"/><rect x="13" y="20" width="3" height="1"/><rect x="23" y="20" width="1" height="1"/>
              <rect x="10" y="21" width="1" height="1"/><rect x="12" y="21" width="2" height="1"/><rect x="15" y="21" width="1" height="1"/><rect x="24" y="21" width="1" height="1"/>
              <rect x="8"  y="22" width="3" height="1"/><rect x="12" y="22" width="1" height="1"/><rect x="14" y="22" width="2" height="1"/><rect x="17" y="22" width="1" height="1"/><rect x="19" y="22" width="2" height="1"/><rect x="23" y="22" width="1" height="1"/>
              <rect x="9"  y="23" width="1" height="1"/><rect x="11" y="23" width="2" height="1"/><rect x="13" y="23" width="1" height="1"/><rect x="16" y="23" width="2" height="1"/><rect x="19" y="23" width="1" height="1"/><rect x="22" y="23" width="2" height="1"/>
              <rect x="8"  y="24" width="2" height="1"/><rect x="11" y="24" width="1" height="1"/><rect x="13" y="24" width="2" height="1"/><rect x="16" y="24" width="1" height="1"/><rect x="18" y="24" width="2" height="1"/><rect x="21" y="24" width="1" height="1"/><rect x="23" y="24" width="2" height="1"/>
            </g>
          </svg>

          {/* 노란 모서리 마커 (인식 시) */}
          {detected && (
            <>
              <span className="ios-cam-corner tl"/>
              <span className="ios-cam-corner tr"/>
              <span className="ios-cam-corner bl"/>
              <span className="ios-cam-corner br"/>
            </>
          )}
        </div>

        {/* 인식된 URL 칩 */}
        {detected && (
          <button
            className={`ios-cam-detect-chip ${pulse ? 'pulse' : ''}`}
            onClick={onDetected}
            aria-label={`${detectUrl} 열기`}
          >
            <svg className="ios-cam-chip-leading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="ios-cam-chip-text">{detectUrl}</span>
            <span className="ios-cam-chip-x" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </span>
          </button>
        )}

        {/* 우하단 보조 — QR 자동 스캔 토글 (시각만) */}
        {detected && (
          <button className="ios-cam-scan-toggle" aria-label="QR 스캔" onClick={onDetected}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="6" height="6"/>
              <rect x="15" y="3" width="6" height="6"/>
              <rect x="3" y="15" width="6" height="6"/>
              <path d="M21 21v-3a2 2 0 0 0-2-2h-3"/>
              <path d="M15 21h.01"/>
              <path d="M21 15h.01"/>
            </svg>
          </button>
        )}
      </div>

      {/* 하단 컨트롤 */}
      <div className="ios-cam-bottom">
        <div className="ios-cam-thumb" aria-hidden="true"/>
        <div className="ios-cam-modes">
          <span className="ios-cam-mode">비디오</span>
          <span className="ios-cam-mode active">사진</span>
        </div>
        <button className="ios-cam-shutter" aria-label="촬영" tabIndex={-1}>
          <span className="ios-cam-shutter-inner"/>
        </button>
        <button className="ios-cam-flip" aria-label="전환">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

window.CameraScreen = CameraScreen;
