from __future__ import annotations

import re
from urllib.parse import urlparse

from playwright.sync_api import Browser, Error, Page, sync_playwright

from policy import Policy


class BrowserTool:
    def __init__(self, policy: Policy) -> None:
        self.policy = policy
        self._pw = None
        self._browser: Browser | None = None
        self._page: Page | None = None

    def _ensure(self) -> Page:
        if self._page:
            return self._page
        self._pw = sync_playwright().start()
        self._browser = self._pw.chromium.launch(headless=True)
        context = self._browser.new_context()
        self._page = context.new_page()
        return self._page

    def _check_domain(self, url: str) -> None:
        host = (urlparse(url).hostname or "").lower()
        if not self.policy.is_domain_allowed(host):
            raise PermissionError(f"Domain not allowed by policy: {host}")

    def open(self, url: str) -> dict:
        self._check_domain(url)
        page = self._ensure()
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        return {"url": page.url, "title": page.title()}

    def snapshot(self) -> dict:
        page = self._ensure()
        data = page.evaluate(
            """
            () => {
              const elements = Array.from(document.querySelectorAll('a,button,input,textarea,select,[role="button"]'))
                .slice(0, 120)
                .map((el, idx) => {
                  const id = `e${idx + 1}`;
                  el.setAttribute('data-agent-id', id);
                  const text = (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 120);
                  return {
                    id,
                    tag: el.tagName.toLowerCase(),
                    text,
                    href: el.getAttribute('href') || null,
                    type: el.getAttribute('type') || null,
                  };
                });
              return {
                title: document.title,
                url: window.location.href,
                elements,
              };
            }
            """
        )
        return data

    def _locator_by_id(self, element_id: str):
        if not re.match(r"^e\d+$", element_id):
            raise ValueError("Invalid element_id")
        page = self._ensure()
        locator = page.locator(f'[data-agent-id="{element_id}"]').first
        if locator.count() == 0:
            raise ValueError(f"Element not found: {element_id}. Run browser_snapshot first.")
        return locator

    def click(self, element_id: str) -> dict:
        locator = self._locator_by_id(element_id)
        locator.click(timeout=10000)
        page = self._ensure()
        return {"url": page.url, "title": page.title()}

    def type(self, element_id: str, text: str) -> dict:
        locator = self._locator_by_id(element_id)
        locator.fill(text, timeout=10000)
        return {"typed": True, "element_id": element_id}

    def close(self) -> None:
        if self._browser:
            try:
                self._browser.close()
            except Error:
                pass
        if self._pw:
            try:
                self._pw.stop()
            except Error:
                pass
        self._browser = None
        self._pw = None
        self._page = None
