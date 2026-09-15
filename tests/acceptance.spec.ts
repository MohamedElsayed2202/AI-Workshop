import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { DashboardData } from "../src/types";

const data: DashboardData = JSON.parse(
  readFileSync(fileURLToPath(new URL("../public/data.json", import.meta.url)), "utf8"),
);

const currency = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const parseMoney = (s: string) => Number(s.replace(/[^0-9.-]/g, ""));

function matches(query: string) {
  const q = query.toLowerCase();
  return data.accounts.filter((a) =>
    [a.name, a.owner, a.plan, a.region, a.status].some((f) => f.toLowerCase().includes(q)),
  );
}

async function open(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByTestId("accounts-table")).toBeVisible();
  return errors;
}

test.describe("PulseBoard acceptance", () => {
  test("page shell loads without console errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle(/PulseBoard/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("PulseBoard");
    expect(errors, `console errors:\n${errors.join("\n")}`).toEqual([]);
  });

  test("KPI header shows four cards with labels and formatted values", async ({ page }) => {
    await open(page);
    const cards = page.getByTestId("kpi-row").getByTestId("kpi-card");
    await expect(cards).toHaveCount(4);
    for (const [i, kpi] of data.kpis.entries()) {
      await expect(cards.nth(i)).toContainText(kpi.label);
    }
    const mrr = data.kpis.find((k) => k.id === "mrr")!;
    await expect(cards.nth(0)).toContainText(currency(mrr.value));
    const churn = data.kpis.find((k) => k.id === "churn-rate")!;
    await expect(page.getByTestId("kpi-row")).toContainText(`${(churn.value * 100).toFixed(1)}%`);
  });

  test("revenue chart renders as SVG or canvas with an accessible name", async ({ page }) => {
    await open(page);
    const chart = page.getByTestId("revenue-chart");
    await expect(chart).toBeVisible();
    await expect(chart.locator("svg, canvas").first()).toBeVisible();
    const hasName = await chart.evaluate((el) => {
      const named = (n: Element) =>
        Boolean(n.getAttribute("aria-label") || n.getAttribute("aria-labelledby")) ||
        (n.getAttribute("role") === "img" && Boolean(n.getAttribute("title")));
      return named(el) || Array.from(el.querySelectorAll("*")).some(named);
    });
    expect(hasName, "chart needs aria-label or role=img with a label").toBe(true);
  });

  test("accounts table lists every account", async ({ page }) => {
    await open(page);
    const rows = page.getByTestId("accounts-table").locator("tbody").getByTestId("account-row");
    await expect(rows).toHaveCount(data.accounts.length);
    for (const a of data.accounts.slice(0, 3)) {
      await expect(page.locator(`[data-account-id="${a.id}"]`)).toContainText(a.name);
    }
  });

  test("clicking the MRR header sorts ascending, then descending", async ({ page }) => {
    await open(page);
    const sortBtn = page.getByTestId("sort-mrr");
    const cells = page.getByTestId("accounts-table").getByTestId("cell-mrr");
    const expected = data.accounts.map((a) => a.mrr).sort((a, b) => a - b);

    await sortBtn.click();
    await expect.poll(async () => (await cells.allTextContents()).map(parseMoney)).toEqual(expected);

    await sortBtn.click();
    await expect.poll(async () => (await cells.allTextContents()).map(parseMoney)).toEqual([...expected].reverse());
  });

  test("filter narrows rows across name, owner, plan, region and status", async ({ page }) => {
    await open(page);
    const filter = page.getByTestId("table-filter");
    const rows = page.getByTestId("accounts-table").locator("tbody").getByTestId("account-row");

    for (const q of ["churned", "sofia", "apac", "enterprise", "Orion"]) {
      await filter.fill(q);
      await expect(rows).toHaveCount(matches(q).length);
    }

    await filter.fill("zzz-no-such-account");
    await expect(rows).toHaveCount(0);
    await expect(page.getByTestId("table-empty")).toBeVisible();

    await filter.fill("");
    await expect(rows).toHaveCount(data.accounts.length);
  });

  test("clicking a row opens the detail drawer; button and Escape close it", async ({ page }) => {
    await open(page);
    const target = data.accounts.find((a) => a.id === "acc-007")!;
    await expect(page.getByTestId("detail-drawer")).toBeHidden();

    await page.locator(`[data-account-id="${target.id}"]`).click();
    const drawer = page.getByTestId("detail-drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("role", "dialog");
    await expect(drawer).toContainText(target.name);
    await expect(drawer).toContainText(target.ownerEmail);
    await expect(drawer).toContainText(target.notes);

    await page.getByTestId("drawer-close").click();
    await expect(drawer).toBeHidden();

    await page.locator(`[data-account-id="acc-003"]`).click();
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });
});
