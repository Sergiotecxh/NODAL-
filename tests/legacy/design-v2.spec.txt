import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { appendFileSync } from "node:fs";
import { resolve } from "node:path";

const routes = [
  ["Inicio", "home"],
  ["Bookings", "bookings"],
  ["Discover", "discover"],
  ["Servicios", "services"],
  ["Perfil", "profile"],
] as const;
const title = "A slower kind of sunset.";
const openOpportunity = (page: Page) =>
  page.getByRole("button", { name: `Ver oportunidad: ${title}`, exact: true });
const nav = (page: Page, name: string) =>
  page
    .getByRole("button", { name, exact: true })
    .filter({ visible: true })
    .first();

async function accessible(page: Page) {
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const violations = audit.violations.map((v) => ({
    id: v.id,
    targets: v.nodes.map((n) => ({
      target: n.target,
      summary: n.failureSummary,
    })),
  }));
  appendFileSync(
    resolve("artifacts/accessibility.jsonl"),
    JSON.stringify({
      url: page.url(),
      viewport: page.viewportSize(),
      test: test.info().title,
      violations,
    }) + "\n",
  );
  expect.soft(violations).toEqual([]);
}

async function noOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 1);
}

test("sample content has five distinct navigable destinations without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByText(/vista de diseño/i).first()).toBeVisible();
  for (const [name, route] of [...routes.slice(1), routes[0]]) {
    const destination = nav(page, name);
    await destination.click();
    await expect(page).toHaveURL(new RegExp(`#${route}$`));
    await expect(destination).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("main")).toBeFocused();
  }
  expect(errors).toEqual([]);
});

test("city, genre and search filters compose and survive navigation", async ({
  page,
}) => {
  await page.goto("/#bookings");
  const city = page.getByRole("combobox", { name: "Ubicación", exact: true });
  const genre = page.getByRole("combobox", { name: "Género", exact: true });
  const search = page.getByRole("textbox", {
    name: "Buscar oportunidades",
    exact: true,
  });
  await city.selectOption("ibiza");
  await expect(page.locator("article.opportunity-card")).toHaveCount(1);
  await expect(openOpportunity(page)).toBeVisible();
  await genre.selectOption("Organic house");
  await expect(page.locator("article.opportunity-card")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Hay más horizontes por descubrir." }),
  ).toBeVisible();
  await city.selectOption("worldwide");
  await expect(page.locator("article.opportunity-card")).toHaveCount(1);
  await genre.selectOption("all");
  await search.pressSequentially("Rooted");
  await expect(search).toBeFocused();
  await expect(page.locator("article.opportunity-card")).toHaveCount(1);
  await nav(page, "Inicio").click();
  await nav(page, "Bookings").click();
  await expect(search).toHaveValue("Rooted");
  await expect(genre).toHaveValue("all");
  await page
    .getByRole("button", { name: "Limpiar filtros", exact: true })
    .click();
  await expect(search).toHaveValue("");
  await expect(page.locator("article.opportunity-card")).toHaveCount(3);
});

test("saved opportunities remain local and can be removed from their own view", async ({
  page,
}) => {
  await page.goto("/#bookings");
  const save = page.getByRole("button", {
    name: `Guardar: ${title}`,
    exact: true,
  });
  await save.click();
  await expect(
    page.getByRole("button", {
      name: `Quitar de guardados: ${title}`,
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: `Quitar de guardados: ${title}`,
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /^Guardadas/ }).click();
  await expect(page.locator("article.opportunity-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: `Quitar de guardados: ${title}`, exact: true })
    .click();
  await expect(page.locator("article.opportunity-card")).toHaveCount(0);
  await expect(
    page.getByText("Guarda una oportunidad para encontrarla aquí.", {
      exact: true,
    }),
  ).toBeVisible();
});

test("contextual details close on Escape and return keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = openOpportunity(page);
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/ibiza/i).first()).toBeVisible();
  await accessible(page);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("Quick Apply shows an honest simulation and sends no application", async ({
  page,
}) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method()))
      writes.push(request.url());
  });
  await page.goto("/");
  await openOpportunity(page).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Probar Quick Apply", exact: true })
    .click();
  await expect(
    dialog.getByText("Simulación completada", { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByText(
      "No se ha enviado ninguna solicitud. Este recorrido sólo muestra la interacción propuesta.",
      { exact: true },
    ),
  ).toBeVisible();
  expect(writes).toEqual([]);
});

test("the editable profile persists in this browser and does not create an account", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /crear mi perfil/i })
    .first()
    .click();
  await page
    .getByLabel("Nombre artístico", { exact: true })
    .fill("Mi nombre de prueba");
  await expect(
    page.getByText(
      "Esta edición se guarda sólo en este navegador. No crea una cuenta ni publica un perfil.",
      { exact: true },
    ),
  ).toBeVisible();
  await accessible(page);
  await page
    .getByRole("button", { name: "Guardar perfil de muestra", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  const local = await page.evaluate(() =>
    localStorage.getItem("nodal-design-v2"),
  );
  expect(local).toContain("Mi nombre de prueba");
  await nav(page, "Perfil").click();
  await page
    .getByRole("button", { name: /editar.*perfil|empezar mi perfil/i })
    .first()
    .click();
  await expect(
    page.getByLabel("Nombre artístico", { exact: true }),
  ).toHaveValue("Mi nombre de prueba");
});

test("appearance preferences persist and reduced motion stops ambient animation", async ({
  page,
}) => {
  await page.goto("/");
  const originalBackground = await page
    .locator("body")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole("button", { name: "Preferencias", exact: true }).click();
  await page.getByRole("button", { name: "Salvia", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-palette", "sage");
  expect(
    await page
      .locator("body")
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(originalBackground);
  await page.getByRole("checkbox").uncheck();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "quiet");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-palette", "sage");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "quiet");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    ),
  ).toBe(0);
});

test("desktop and mobile routes retain readable layout and basic accessibility", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1050 : 844 });
    await noOverflow(page);
    await expect(page.getByRole("main")).toBeVisible();
    await accessible(page);
    if (width === 1440)
      await page.screenshot({
        path: "artifacts/home-desktop.png",
        fullPage: false,
      });
    if (width === 390)
      await page.screenshot({
        path: "artifacts/home-mobile.png",
        fullPage: false,
      });
    {
      for (const [, route] of routes.slice(1)) {
        await page.goto("/#" + route);
        await expect(page.getByRole("main")).toBeVisible();
        await noOverflow(page);
        await accessible(page);
      }
      await page.goto("/");
    }
  }
});

test("Discover explains empty location results and lets the visitor recover", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Ubicación", { exact: true }).selectOption("ibiza");
  await page
    .getByRole("button", { name: "Discover", exact: true })
    .filter({ visible: true })
    .first()
    .click();
  await expect(
    page.getByText("Un nuevo sonido espera por ti.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Explorar todos los perfiles", exact: false })
    .click();
  await expect(page.locator(".artist-card")).toHaveCount(3);
  await page
    .getByRole("textbox", { name: "Buscar artistas", exact: true })
    .pressSequentially("Elena");
  await expect(page.locator(".artist-card")).toHaveCount(1);
  await expect(page.locator(".artist-card")).toContainText("Elena Sol");
});
