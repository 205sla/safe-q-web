"""내 정보 화면 3개 탭 캡처 (검증용)"""
import os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8765"
OUT = "C:/Users/young/prg/ai/safe-q-web/screenshots/apple"
os.makedirs(OUT, exist_ok=True)
VP = {"width": 440, "height": 920}

def main():
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(device_scale_factor=2)
        pg = ctx.new_page()
        pg.goto(BASE + "/"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)

        captures = [
            ("profile-1.png", None,    "프로필 탭 (기본)"),
            ("profile-2.png", "계정 설정", "계정 설정 탭"),
            ("profile-3.png", "그룹 관리", "그룹 관리 탭"),
        ]
        for fname, segtab, desc in captures:
            pg.set_viewport_size(VP)
            pg.goto("about:blank")
            pg.add_init_script("try{localStorage.setItem('safeq.session',JSON.stringify({userId:'u001'}))}catch(e){}")
            pg.goto(BASE + "/#/home", wait_until="domcontentloaded")
            try: pg.wait_for_function("document.querySelector('.phone')!==null", timeout=8000)
            except: pass
            pg.wait_for_timeout(900)
            # 탭바의 '내 정보' 클릭
            try:
                pg.locator("button.tab:has-text('내 정보')").first.click(timeout=3000)
                pg.wait_for_timeout(600)
            except Exception as e:
                print(f"  ⚠️ 내 정보 탭 클릭 실패: {e}")
            # 서브 탭 전환
            if segtab:
                try:
                    pg.locator(f"button.seg:has-text('{segtab}')").first.click(timeout=3000)
                    pg.wait_for_timeout(400)
                    # 그룹 관리는 첫 그룹 펼치기
                    if segtab == "그룹 관리":
                        pg.locator("button.group-head").first.click(timeout=2000)
                        pg.wait_for_timeout(400)
                except Exception as e:
                    print(f"  ⚠️ seg '{segtab}' 실패: {e}")
            out = os.path.join(OUT, fname)
            pg.screenshot(path=out)
            print(f"  ✓ {fname}  ({os.path.getsize(out)//1024} KB)  — {desc}")
        b.close()
    print("✅ 완료")

if __name__ == "__main__":
    main()
