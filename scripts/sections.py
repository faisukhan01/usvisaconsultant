import asyncio
from playwright.async_api import async_playwright

URL = "http://127.0.0.1:3000"
SECTIONS = ["about", "services", "process", "destinations", "testimonials", "contact", "faq"]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 375, "height": 812}, is_mobile=True, has_touch=True)
        await page.goto(URL, wait_until="load", timeout=60000)
        await page.wait_for_timeout(3000)
        for sec in SECTIONS:
            await page.evaluate(f"document.querySelector('#{sec}').scrollIntoView()")
            await page.wait_for_timeout(1400)
            await page.screenshot(path=f"/tmp/pw-m-{sec}.png")
        await browser.close()

asyncio.run(main())
