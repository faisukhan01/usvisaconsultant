import asyncio
from playwright.async_api import async_playwright

URL = "http://127.0.0.1:3000"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto(URL, wait_until="load", timeout=60000)
        await page.wait_for_timeout(3000)
        # scroll into contact, focus the map card
        await page.evaluate("document.querySelector('#contact').scrollIntoView()")
        await page.wait_for_timeout(2500)
        await page.screenshot(path="/tmp/pw-d-contact.png")
        # scroll to footer for FABs
        await page.evaluate("window.scrollBy(0, 600)")
        await page.wait_for_timeout(800)
        await page.screenshot(path="/tmp/pw-d-fabs.png")
        await browser.close()

asyncio.run(main())
