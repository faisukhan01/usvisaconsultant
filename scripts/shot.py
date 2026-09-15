import asyncio, sys
from playwright.async_api import async_playwright

URL = "http://127.0.0.1:3000"

async def main():
    label = sys.argv[1] if len(sys.argv) > 1 else "hero2"
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto(URL, wait_until="load", timeout=60000)
        await page.wait_for_timeout(5000)
        await page.screenshot(path=f"/tmp/pw-{label}.png")
        await browser.close()

asyncio.run(main())
