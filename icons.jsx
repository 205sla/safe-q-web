// Shared icons + tiny UI helpers. Exported to window for cross-script use.
// Icons follow Lucide's geometric-rounded style; 24px / 1.75 stroke.

const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 1.75 }) => {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'home':       return <svg {...common}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>;
    case 'qr':         return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM14 20h3M20 14v3M17 17v4M14 21h3"/></svg>;
    case 'map':        return <svg {...common}><path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/></svg>;
    case 'user':       return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case 'lock':       return <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
    case 'mail':       return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    case 'eye':        return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'eye-off':    return <svg {...common}><path d="M3 3l18 18"/><path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a17.3 17.3 0 0 1-3.4 4.3"/><path d="M6.7 7.1A17.3 17.3 0 0 0 2 12s3.5 6 10 6c1.8 0 3.4-.4 4.8-1.1"/><path d="M14.1 14.1a3 3 0 0 1-4.2-4.2"/></svg>;
    case 'check':      return <svg {...common}><path d="m5 12 5 5 9-11"/></svg>;
    case 'x':          return <svg {...common}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case 'arrow-r':    return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'arrow-l':    return <svg {...common}><path d="M19 12H5M11 5l-7 7 7 7"/></svg>;
    case 'chevron-r':  return <svg {...common}><path d="m9 6 6 6-6 6"/></svg>;
    case 'share':      return <svg {...common}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5 15.4 17M15.4 7 8.6 10.5"/></svg>;
    case 'flag':       return <svg {...common}><path d="M4 21V4M4 4h13l-2 4 2 4H4"/></svg>;
    case 'shield':     return <svg {...common}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z"/></svg>;
    case 'shield-check':return <svg {...common}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/></svg>;
    case 'shield-alert':return <svg {...common}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z"/><path d="M12 9v4M12 16v.5"/></svg>;
    case 'alert-tri':  return <svg {...common}><path d="m12 3 10 17H2L12 3zM12 10v4M12 17v.5"/></svg>;
    case 'info':       return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 8v.5M12 11v5"/></svg>;
    case 'history':    return <svg {...common}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>;
    case 'plus':       return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case 'pin':        return <svg {...common}><path d="M12 21s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'pin-off':    return <svg {...common}><path d="M3 3l18 18"/><path d="M19 9c0 5-7 12-7 12s-3-3-5-6"/><path d="M9 4.5A7 7 0 0 1 19 9"/></svg>;
    case 'crosshair':  return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="2"/></svg>;
    case 'search':     return <svg {...common}><circle cx="11" cy="11" r="6"/><path d="m20 20-3.2-3.2"/></svg>;
    case 'sliders':    return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="7" cy="17" r="2" fill="currentColor"/></svg>;
    case 'copy':       return <svg {...common}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>;
    case 'bell':       return <svg {...common}><path d="M6 9a6 6 0 0 1 12 0c0 4 2 6 2 6H4s2-2 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
    case 'log-out':    return <svg {...common}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>;
    case 'users':      return <svg {...common}><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M16 4a4 4 0 0 1 0 8"/><path d="M18 15c3 0 4 2 4 6"/></svg>;
    case 'heart':      return <svg {...common}><path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11z"/></svg>;
    case 'code':       return <svg {...common}><path d="m9 8-5 4 5 4M15 8l5 4-5 4M14 4l-4 16"/></svg>;
    case 'external':   return <svg {...common}><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></svg>;
    case 'bookmark':   return <svg {...common}><path d="M5 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17l-7-4-7 4z"/></svg>;
    case 'globe':      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'sparkles':   return <svg {...common}><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><path d="M12 6 9 9l3 3 3-3-3-3zM18 14l-2 2 2 2 2-2-2-2z"/></svg>;
    case 'refresh':    return <svg {...common}><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>;
    case 'wifi-off':   return <svg {...common}><path d="M3 3l18 18"/><path d="M9.5 17a4 4 0 0 1 5 0"/><path d="M5 13a10 10 0 0 1 14.5-1"/><path d="M2 9a14 14 0 0 1 5-3M22 9a14 14 0 0 0-6-3.5"/></svg>;
    case 'menu':       return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case 'gear':       return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.4l2-1.5-2-3.5-2.4.8a7 7 0 0 0-2.4-1.4L13.5 3h-3l-.6 2a7 7 0 0 0-2.4 1.4l-2.4-.8-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .5 0 1 .1 1.4l-2 1.5 2 3.5 2.4-.8a7 7 0 0 0 2.4 1.4l.6 2h3l.6-2a7 7 0 0 0 2.4-1.4l2.4.8 2-3.5-2-1.5c.1-.4.1-.9.1-1.4z"/></svg>;
    case 'spark':      return <svg {...common}><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/></svg>;
    default: return null;
  }
};

// Toast manager via global event
function toast(msg, kind = 'default') {
  window.dispatchEvent(new CustomEvent('safe-q:toast', { detail: { msg, kind } }));
}

function ToastHost() {
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    const onToast = (e) => {
      const id = Date.now() + Math.random();
      setToasts(t => [...t, { id, ...e.detail }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2200);
    };
    window.addEventListener('safe-q:toast', onToast);
    return () => window.removeEventListener('safe-q:toast', onToast);
  }, []);
  return (
    <div className="toast-host">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.kind}`}>
          {t.kind === 'success' && <Icon name="check" size={14} />}
          {t.kind === 'danger' && <Icon name="alert-tri" size={14} />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Icon, toast, ToastHost });
