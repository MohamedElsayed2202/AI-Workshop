import { test } from "@playwright/test";

/**
 * Not an acceptance test. `npm run screenshot` captures the current UI at the two
 * viewports the design was drawn for, so you can compare against design/.
 */
const viewports = [
  { name: "desktop-1280x800", width: 1280, height: 800 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "mobile-375x812", width: 375, height: 812 },
];

for (const vp of viewports) {
  test(`screenshot ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `screenshots/${vp.name}.png`, fullPage: true });
  });
}
