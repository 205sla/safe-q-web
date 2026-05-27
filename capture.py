"""
Apple-toned screenshot capture for Safe Q-Web demo.
Playwright (Chromium) against a local static server.

Usage: python capture.py
Requires: pip install playwright; python -m playwright install chromium
"""
import os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from playwright.sync_api import sync_playwright

BASE = "http://localhost:8765"
OUT  = "C:/Users/young/prg/ai/safe-q-web/screenshots/apple"
os.makedirs(OUT, exist_ok=True)

# Phone-frame snug viewport (390 + 24*2 padding)
VIEWPORT_PHONE = {"width": 440, "height": 920}
# Wide view to include camera app icon outside phone
VIEWPORT_WIDE  = {"width": 700, "height": 950}

# (filename, hash, wait_ms_after_load, [actions], viewport, requires_login)
CAPTURES = [
    ("login.png",                 "#/login",              1200, [], VIEWPORT_PHONE, False),
    ("login-error.png",           "#/login",              900,  [("try_click", "button:has-text('네트워크 오류')"),
                                                                  ("try_click", "button:has-text('오류 시뮬')")], VIEWPORT_PHONE, False),
    ("home.png",                  "#/home",               1300, [], VIEWPORT_PHONE, True),
    ("scan-loading.png",          "#/scan?state=loading", 250,  [], VIEWPORT_PHONE, True),
    ("scan-safe.png",             "#/scan?risk=safe",     1600, [], VIEWPORT_PHONE, True),
    ("scan-warning.png",          "#/scan?risk=warning",  1600, [], VIEWPORT_PHONE, True),
    ("scan-danger.png",           "#/scan?risk=danger",   1600, [], VIEWPORT_PHONE, True),
    ("scan-danger-confirm.png",   "#/scan?risk=danger",   1600, [
        ("try_click", "button:has-text('위험 감수')"),
        ("try_click", "button:has-text('계속 진행')"),
        ("try_click", "button:has-text('사이트로')"),
    ], VIEWPORT_PHONE, True),
    ("map.png",                   "#/map",                2500, [], VIEWPORT_PHONE, True),
    ("map-detail.png",            "#/map",                2500, [
        ("try_click", ".leaflet-marker-icon"),
        ("try_click", ".leaflet-marker-pane > *:first-child"),
    ], VIEWPORT_PHONE, True),
    # Bonus
    ("scan-error.png",            "#/scan?state=error",   1000, [], VIEWPORT_PHONE, True),
    ("home-wide.png",             "#/home",               1300, [], VIEWPORT_WIDE,  True),
    ("camera-detect.png",         "#/home",               700,  [
        ("click", ".ios-app-icon-camera"),
        ("wait", 2200),
    ], VIEWPORT_WIDE,  True),
]


def do_action(page, action):
    kind, *rest = action
    if kind == "click":
        sel = rest[0]
        try:
            page.locator(sel).first.click(timeout=3000)
            page.wait_for_timeout(400)
        except Exception as e:
            print(f"   ⚠️ click '{sel}' failed: {e}")
    elif kind == "try_click":
        sel = rest[0]
        try:
            loc = page.locator(sel).first
            if loc.count() > 0 and loc.is_visible():
                loc.click(timeout=2000)
                page.wait_for_timeout(450)
                print(f"   ✓ optional click '{sel}'")
        except Exception:
            pass
    elif kind == "wait":
        page.wait_for_timeout(rest[0])


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(device_scale_factor=2)
        page = context.new_page()

        # warm up the page so subsequent loads are fast
        print(f"Warming up at {BASE}…")
        page.goto(BASE + "/")
        page.wait_for_load_state("networkidle", timeout=10000)
        page.wait_for_timeout(1000)

        ok = 0
        for fname, hash_url, wait_ms, actions, viewport, needs_login in CAPTURES:
            print(f"\n▶ {fname}  ({hash_url}, login={needs_login})")
            page.set_viewport_size(viewport)

            # Force fresh mount each time by routing through about:blank
            page.goto("about:blank")
            # Pre-set or clear localStorage session BEFORE the SPA mounts
            page.add_init_script(
                "try { "
                f"if ({str(needs_login).lower()}) "
                "localStorage.setItem('safeq.session', JSON.stringify({userId:'u001'})); "
                "else localStorage.removeItem('safeq.session'); "
                "} catch(e) {}"
            )

            url = BASE + "/" + hash_url
            page.goto(url, wait_until="domcontentloaded")
            # Wait for React to mount and Babel to finish
            try:
                page.wait_for_function("document.querySelector('.phone') !== null", timeout=8000)
            except Exception:
                pass
            try:
                page.wait_for_load_state("networkidle", timeout=8000)
            except Exception:
                pass
            page.wait_for_timeout(wait_ms)

            for action in actions:
                do_action(page, action)

            out = os.path.join(OUT, fname)
            page.screenshot(path=out, full_page=False)
            size_kb = os.path.getsize(out) // 1024
            print(f"   saved {fname}  ({size_kb} KB)")
            if size_kb > 25:
                ok += 1

        browser.close()
        print(f"\n✅ {ok}/{len(CAPTURES)} captures look non-blank ({OUT})")


if __name__ == "__main__":
    main()
