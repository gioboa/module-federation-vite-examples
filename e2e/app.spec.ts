import { expect, test } from "@playwright/test";

const isSharedState = process.env.PLAYWRIGHT_TEST_COMMAND?.includes("vue");
const isNuxt = process.env.PLAYWRIGHT_TEST_COMMAND?.includes("nuxt");
const isSvelteKit = process.env.PLAYWRIGHT_TEST_COMMAND?.includes("svelte");
const isVinext = process.env.PLAYWRIGHT_TEST_COMMAND?.includes("vinext");
const isSsrCardsExample = isNuxt || isSvelteKit || isVinext;
const isTanStack = process.env.PLAYWRIGHT_TEST_COMMAND?.includes("tanstack");

const btn = (page: any, name: RegExp) => page.getByRole("button", { name }).first();

test.describe("standard examples", () => {
  test.skip(isTanStack || isSsrCardsExample, "SSR examples have specific coverage");

  test("host app and remote component should load and counters should work", async ({ page }) => {
    await page.goto("/");

    // Verify the Host and Remote apps loaded
    await expect(page.getByText("I'm the host app")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("I'm the remote app").first()).toBeVisible({
      timeout: 10000,
    });

    // Verify counters start at 0
    await expect(btn(page, /Host counter: 0/)).toBeVisible({ timeout: 10000 });
    await expect(btn(page, /Remote counter: 0/)).toBeVisible({ timeout: 10000 });

    // Click host counter and verify it increments
    await btn(page, /Host counter: 0/).click();
    await expect(btn(page, /Host counter: 1/)).toBeVisible();

    if (isSharedState) {
      // Vue/Nuxt shares state via Pinia - remote should also be 1
      await expect(btn(page, /Remote counter: 1/)).toBeVisible();
    }

    // Click remote counter
    await btn(page, isSharedState ? /Remote counter: 1/ : /Remote counter: 0/).click();
    await expect(
      btn(page, isSharedState ? /Remote counter: 2/ : /Remote counter: 1/)
    ).toBeVisible();

    if (isSharedState) {
      // Vue/Nuxt shared state - host should also be 2
      await expect(btn(page, /Host counter: 2/)).toBeVisible();
    }

    // Click host counter again
    await btn(page, isSharedState ? /Host counter: 2/ : /Host counter: 1/).click();
    await expect(btn(page, isSharedState ? /Host counter: 3/ : /Host counter: 2/)).toBeVisible();

    if (isSharedState) {
      // Vue/Nuxt shared state - remote should also be 3
      await expect(btn(page, /Remote counter: 3/)).toBeVisible();
    } else {
      // Independent state - remote should still be 1
      await expect(btn(page, /Remote counter: 1/)).toBeVisible();

      // Click remote again and verify independent increment
      await btn(page, /Remote counter: 1/).click();
      await expect(btn(page, /Remote counter: 2/)).toBeVisible();

      // Host still at 2
      await expect(btn(page, /Host counter: 2/)).toBeVisible();
    }
  });
});

test.describe("SSR card examples", () => {
  test.skip(!isSsrCardsExample, "nuxt/sveltekit/vinext only");

  test("host app and remote components should load", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("I'm the host app")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Host SSR component")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("I'm the remote app")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Remote SSR component")).toBeVisible({ timeout: 10000 });

    await expect(btn(page, /Host counter: 0/)).toBeVisible({ timeout: 10000 });
    await expect(btn(page, /SSR counter: 0/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: /Remote counter: 0/ })).toHaveCount(2);
  });

  test("shared remote components are server-rendered", async ({ request }) => {
    test.skip(!isVinext, "vinext only");
    const html = await (await request.get("/")).text();

    // The remote components must arrive as server-rendered HTML, not as
    // Suspense fallbacks that React later client-renders (error #419).
    expect(html).toContain("remote app");
    expect(html).toContain("Remote SSR component");
    // React SSR splits adjacent text nodes with <!-- --> separators, so the
    // fallback serializes as "Loading <!-- -->remote/Widget…" — a plain
    // toContain("Loading remote/Widget") could never fail.
    expect(html).not.toMatch(/Loading (<!-- -->)?remote\/Widget/);
    expect(html).not.toMatch(/Loading (<!-- -->)?remote\/Counter/);
    // React marks a server-errored Suspense boundary with a digest template.
    expect(html).not.toContain("<template data-dgst=");
  });

  test("all counters should be interactive after hydration", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/Hydrated/i).first()).toBeVisible({ timeout: 10000 });

    await expect(async () => {
      await btn(page, /Host counter: 0/).click();
      await expect(btn(page, /Host counter: 1/)).toBeVisible({ timeout: 500 });
    }).toPass({ timeout: 10000 });

    await btn(page, /SSR counter: 0/).click();
    await expect(btn(page, /SSR counter: 1/)).toBeVisible();

    const remoteCounters = page.getByRole("button", { name: /Remote counter: 0/ });
    await remoteCounters.first().click();
    await remoteCounters.last().click();
    await expect(page.getByRole("button", { name: /Remote counter: 1/ })).toHaveCount(2);
  });

  test("hydration badges should update after client-side hydration", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Hydrated", { exact: true })).toHaveCount(2, { timeout: 10000 });
  });

  test("isolated React island should be server-rendered and interactive", async ({ page }) => {
    test.skip(!isVinext, "vinext only");
    await page.goto("/");

    await expect(page.getByText("React 18 SSR island")).toBeVisible({ timeout: 10000 });
    await expect(btn(page, /Island counter: 18/)).toBeVisible({ timeout: 10000 });
    await expect(async () => {
      await btn(page, /Island counter: 18/).click();
      await expect(btn(page, /Island counter: 19/)).toBeVisible({ timeout: 500 });
    }).toPass({ timeout: 10000 });
  });
});

test.describe("tanstack", () => {
  test.skip(!isTanStack, "tanstack only");

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
    await expect(page.getByText(/Theme from host context:/).first()).toBeVisible({
      timeout: 10000,
    });
    const themeLabels = page.getByText("host");
    await expect(themeLabels.first()).toBeVisible({ timeout: 10000 });
  });

  test("hydration badge should update after client-side hydration", async ({ page }) => {
    await page.goto("/");

    // Badge transitions from 'ssr' (server-rendered) to 'hydrated' once JS loads.
    await expect(page.getByText("hydrated").first()).toBeVisible({ timeout: 10000 });
  });
});
