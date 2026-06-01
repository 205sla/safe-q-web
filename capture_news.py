"""최근 피싱 소식 화면 캡처 (검증용): 홈 배너 / 목록 / 상세"""
import os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8765"
OUT = "C:/Users/young/prg/ai/safe-q-web/screenshots/apple"
VP = {"width": 440, "height": 920}

def boot(pg):
    pg.goto("about:blank")
    pg.add_init_script("try{localStorage.setItem('safeq.session',JSON.stringify({userId:'u001'}))}catch(e){}")
    pg.goto(BASE + "/#/home", wait_until="domcontentloaded")
    try: pg.wait_for_function("document.querySelector('.phone')!==null", timeout=8000)
    except: pass
    pg.wait_for_timeout(900)

def main():
    with sync_playwright() as p:
        b = p.chromium.launch(); ctx = b.new_context(device_scale_factor=2); pg = ctx.new_page()
        pg.goto(BASE + "/"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
        pg.set_viewport_size(VP)

        # 1) 홈 (배너 보이게 — 스크롤 살짝)
        boot(pg)
        pg.evaluate("document.querySelector('.screen').scrollTop = 260")
        pg.wait_for_timeout(300)
        pg.screenshot(path=os.path.join(OUT, "news-0-home-banner.png"))
        print("  ✓ news-0-home-banner.png")

        # 2) 뉴스 목록 (배너 클릭)
        boot(pg)
        pg.locator("button.news-banner").first.click(timeout=4000); pg.wait_for_timeout(600)
        pg.screenshot(path=os.path.join(OUT, "news-1-list.png"))
        print("  ✓ news-1-list.png")

        # 3) 상세 시트 (첫 카드 클릭)
        pg.locator("button.news-card").first.click(timeout=4000); pg.wait_for_timeout(500)
        pg.screenshot(path=os.path.join(OUT, "news-2-detail.png"))
        print("  ✓ news-2-detail.png")

        b.close()
    print("✅ 완료")

if __name__ == "__main__":
    main()
