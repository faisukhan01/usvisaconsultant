import asyncio, json
from playwright.async_api import async_playwright

URL = "http://127.0.0.1:3000"
results = {}

async def audit(page, label):
    r = {}
    await page.goto(URL, wait_until="networkidle", timeout=60000)
    await page.wait_for_timeout(3500)
    r["title"] = await page.title()
    # horizontal overflow check
    r["scrollW-clientW"] = await page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
    r["bodyScrollW"] = await page.evaluate("document.body.scrollWidth")
    r["innerW"] = await page.evaluate("window.innerWidth")
    r["videoState"] = await page.evaluate("""() => {
        const v = document.querySelector('video');
        if (!v) return 'none';
        return { readyState: v.readyState, paused: v.paused, src: v.currentSrc.split('/').pop(), vw: v.videoWidth, vh: v.videoHeight };
    }""")
    r["heroText"] = await page.evaluate("document.querySelector('h1')?.innerText || 'MISSING'")
    r["hasGlobeSection"] = await page.evaluate("!!document.querySelector('#global')")
    r["footerLogo"] = await page.evaluate("""() => {
        const imgs = Array.from(document.querySelectorAll('footer img'));
        const el = imgs[0];
        if (!el) return 'none';
        const b = el.getBoundingClientRect();
        return Math.round(b.width);
    }""")
    r["sections"] = await page.evaluate("Array.from(document.querySelectorAll('section[id]')).map(s=>s.id)")
    await page.screenshot(path=f"/tmp/pw-{label}-hero.png")
    await page.screenshot(path=f"/tmp/pw-{label}-full.png", full_page=True)
    return r

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        errors = []
        # Desktop
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        results["desktop"] = await audit(page, "desktop")
        await page.evaluate("document.querySelector('footer').scrollIntoView()")
        await page.wait_for_timeout(1200)
        await page.screenshot(path="/tmp/pw-desktop-footer.png")
        await page.evaluate("document.querySelector('#contact').scrollIntoView()")
        await page.wait_for_timeout(1000)
        results["desktop"]["contactForm"] = await page.evaluate("!!document.querySelector('#contact form')")
        await page.close()

        # Mobile
        page = await browser.new_page(viewport={"width": 375, "height": 812}, is_mobile=True, has_touch=True,
                                      user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
        page.on("console", lambda m: errors.append("[m]"+m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append("[m]"+str(e)))
        results["mobile"] = await audit(page, "mobile")
        await page.evaluate("window.scrollTo(0,0)")
        await page.wait_for_timeout(600)
        btn = page.locator('button[aria-label="Open menu"]')
        results["mobile"]["menuBtnVisible"] = await btn.is_visible()
        if await btn.is_visible():
            await btn.click()
            await page.wait_for_timeout(800)
            results["mobile"]["sheetVisible"] = await page.evaluate("!!document.querySelector('[role=dialog]')")
            await page.screenshot(path="/tmp/pw-mobile-menu.png")
            await page.keyboard.press("Escape")
            await page.wait_for_timeout(500)
        await page.evaluate("document.querySelector('footer').scrollIntoView()")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/tmp/pw-mobile-footer.png")
        await page.close()
        await browser.close()
    print(json.dumps(results, indent=1))
    print("CONSOLE_ERRORS:", json.dumps(errors[:8], indent=1) if errors else "none")

asyncio.run(main())
