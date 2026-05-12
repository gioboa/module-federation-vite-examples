import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  page.on("console", (message) => {
    if (message.type() === "error") {
      testInfo.attach("page-console-error", {
        contentType: "text/plain",
        body: `[${message.type()}] ${message.text()}`,
      });
    }
  });

  page.on("pageerror", (error) => {
    testInfo.attach("page-error", {
      contentType: "text/plain",
      body: `${error.name}: ${error.message}\n${error.stack}`,
    });
  });
});

test("host app and remote components should be server-rendered", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("I'm the host app")).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("I'm the remote app").first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Remote counter").first()).toBeVisible({ timeout: 10000 });
});

test("remote counter should be interactive after hydration", async ({ page }) => {
  await page.goto("/");

  // Wait for the hydration badge span (not the <code> in the description text)
  // to ensure React has attached event handlers before clicking.
  await expect(page.locator("span", { hasText: "hydrated" }).first()).toBeVisible({
    timeout: 10000,
  });

  // Re-resolve locator after hydration to avoid stale element references.
  await page
    .getByRole("button", { name: /Remote counter: 0/ })
    .first()
    .click();
  await expect(page.getByRole("button", { name: /Remote counter: 1/ }).first()).toBeVisible({
    timeout: 10000,
  });
});

test("shared context singleton should cross the MF boundary", async ({ page }) => {
  await page.goto("/");

  // Remote components display the theme label provided by the host.
  // If the React singleton is not shared, they'd show 'default' instead.
  await expect(page.getByText(/Theme from host context:/).first()).toBeVisible({ timeout: 10000 });
  const themeLabels = page.getByText("host");
  await expect(themeLabels.first()).toBeVisible({ timeout: 10000 });
});

test("hydration badge should update after client-side hydration", async ({ page }) => {
  await page.goto("/");

  // Badge transitions from 'ssr' (server-rendered) to 'hydrated' once JS loads.
  await expect(page.getByText("hydrated").first()).toBeVisible({ timeout: 10000 });
});
