import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, appendFileSync } from "node:fs";
import { contactRisk } from "../src/contact-policy";
const sections = [
  "Inicio",
  "Mensajes",
  "Bookings",
  "Discover",
  "Servicios",
  "Perfil",
];
function nav(page: Page, name: string) {
  return page
    .getByRole("navigation")
    .getByRole("button", { name, exact: true })
    .filter({ visible: true })
    .first();
}
async function audit(page: Page, label: string) {
  const a = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const violations = a.violations.map((v) => ({
    id: v.id,
    nodes: v.nodes.map((n) => ({
      target: n.target,
      summary: n.failureSummary,
    })),
  }));
  appendFileSync(
    "artifacts/accessibility.jsonl",
    JSON.stringify({ label, violations }) + "\n",
  );
  expect.soft(violations).toEqual([]);
}
test("six sections render with no runtime errors and all locations remain honest", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  for (const n of sections) {
    await nav(page, n).click();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByText("Vista de diseño · datos de ejemplo"),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test("presskit editor is local; passport opens with country colors and turning pages", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Editar presskit", exact: true })
    .click();
  await page.getByLabel("Nombre artístico", { exact: true }).fill("DJ Prueba");
  await page
    .getByRole("button", { name: "Guardar presskit de muestra" })
    .click();
  await expect(
    page.getByRole("heading", { name: "DJ Prueba", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Abrir mi Scene Passport" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Paleta de origen").selectOption("US");
  await expect(page.locator(".s-book")).toHaveClass(/cover-US/);
  await page.getByLabel("Paleta de origen").selectOption("EU");
  await expect(page.locator(".s-book")).toHaveClass(/cover-EU/);
  await page
    .getByRole("button", { name: "Abrir las hojas del pasaporte" })
    .click();
  await expect(page.locator(".s-book")).toHaveClass(/is-open/);
  await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect(page.getByText("Páginas 3–4", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("dialog").getByText(/No es un documento oficial/),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("selfie requires consent, camera capture works with an emulated device, not identity verification", async ({
  browser,
}) => {
  const context = await browser.newContext({ permissions: ["camera"] });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir mi Scene Passport" }).click();
  await expect(
    page.getByRole("button", { name: "Abrir cámara frontal" }),
  ).toBeDisabled();
  await page
    .getByLabel("Acepto usar mi foto sólo durante esta sesión de diseño.")
    .check();
  await page.getByRole("button", { name: "Abrir cámara frontal" }).click();
  await expect(page.locator("video")).toBeVisible();
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.videoWidth),
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Capturar selfie" }).click();
  await expect(page.locator(".s-passport-photo img")).toBeVisible();
  await page
    .getByRole("button", { name: "Eliminar selfie", exact: true })
    .click();
  await expect(page.locator(".s-passport-photo img")).toHaveCount(0);
  await context.close();
});
test("bookings filters and saved places persist; event publication is gated by explicit demo Pro", async ({
  page,
}) => {
  await page.goto("/#bookings");
  await page
    .getByRole("button", { name: "Guardar: Bruma listening room", exact: true })
    .click();
  await page.getByRole("button", { name: "Guardados", exact: true }).click();
  await expect(page.locator(".s-place")).toHaveCount(1);
  await page.reload();
  await page.getByRole("button", { name: "Guardados", exact: true }).click();
  await expect(page.locator(".s-place")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Publicar evento", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("DJ PRO");
  await page.getByRole("button", { name: "Probar Pro de muestra" }).click();
  await expect(page.getByRole("status")).toContainText("No se cobró");
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Publicar evento", exact: true })
    .click();
  await page.getByLabel("Nombre del evento").fill("Encuentro de prueba");
  await page
    .getByRole("dialog")
    .getByLabel("Fecha", { exact: true })
    .fill("2027-06-15");
  await page.getByRole("button", { name: "Guardar evento de muestra" }).click();
  await expect(
    page.getByRole("button", { name: "Encuentro de prueba", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "sin publicar en internet",
  );
});
test("contact filter detects phone, obfuscation and business diversion while allowing legitimate production", () => {
  for (const s of [
    "mi whatsapp es 222 123 4567",
    "pásame tu número",
    "te paso mi numero",
    "222-123-4567",
    "w h a t s a p p",
    "pagar por fuera",
    "uno dos tres cuatro cinco seis siete ocho nueve",
  ])
    expect(contactRisk(s)).not.toBeNull();
  for (const s of [
    "Necesito 2 CDJ-3000 y un DJM-A9.",
    "El set es de 18:00 a 20:00.",
    "¿Podemos confirmar el rider aquí?",
  ])
    expect(contactRisk(s)).toBeNull();
});
test("chat rejects contact and accepts a structured location without network transmission", async ({
  page,
}) => {
  let posts = 0;
  page.on("request", (r) => {
    if (r.method() === "POST") posts++;
  });
  await page.goto("/#mensajes");
  await page.getByLabel("Escribir mensaje").fill("pasame tu numero");
  await page.getByRole("button", { name: "Enviar mensaje de muestra" }).click();
  await expect(page.getByRole("log")).not.toContainText("pasame tu numero");
  await expect(page.getByRole("status")).toContainText("No se envió");
  await page.getByLabel("Escribir mensaje").fill("Revisemos el rider aquí.");
  await page.getByRole("button", { name: "Enviar mensaje de muestra" }).click();
  await expect(page.getByRole("log")).toContainText("Revisemos el rider aquí.");
  await page.getByRole("button", { name: "Compartir ubicación" }).click();
  await page.getByLabel("Lugar o punto de encuentro").fill("222 123 4567");
  await page
    .getByRole("button", { name: "Compartir lugar de muestra" })
    .click();
  await expect(page.getByRole("log")).not.toContainText("222 123 4567");
  await page
    .getByLabel("Lugar o punto de encuentro")
    .fill("Puebla Centro · punto público");
  await page
    .getByRole("button", { name: "Compartir lugar de muestra" })
    .click();
  await expect(page.getByRole("log")).toContainText("Puebla Centro");
  expect(posts).toBe(0);
});
test("PDF is reachable from profile and returns a real PDF", async ({
  page,
  request,
}) => {
  await page.goto("/#perfil");
  await expect(
    page.getByRole("link", { name: "Plan y costos · PDF", exact: false }),
  ).toHaveAttribute("href", "/reports/NODAL_PLAN_24_MESES.pdf");
  const r = await request.get("/reports/NODAL_PLAN_24_MESES.pdf");
  expect(r.status()).toBe(200);
  expect((await r.body()).subarray(0, 5).toString()).toBe("%PDF-");
});
test("six pages fit desktop and phones; audit and capture actual UI", async ({
  page,
}) => {
  test.setTimeout(120000);
  mkdirSync("artifacts", { recursive: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1050 : 844 });
    await page.goto("/");
    for (const n of sections) {
      await nav(page, n).click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + 1);
      await audit(page, n + "-" + width);
    }
    await nav(page, "Inicio").click();
    if (width !== 320)
      await page.screenshot({
        path:
          "artifacts/studio-" +
          (width === 1440 ? "desktop" : "mobile") +
          ".png",
        fullPage: true,
      });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Abrir mi Scene Passport" }).click();
  await page
    .getByRole("button", { name: "Abrir las hojas del pasaporte" })
    .click();
  await page.screenshot({
    path: "artifacts/passport-mobile.png",
    fullPage: false,
  });
  await audit(page, "Passport-mobile");
});

test("corrupted local preferences recover without crashing", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "nodal-studio-v3",
      JSON.stringify({ name: { bad: true }, events: [null], saved: [null] }),
    ),
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Tu nombre artístico", exact: true }),
  ).toBeVisible();
  await nav(page, "Bookings").click();
  await expect(page.locator(".s-place")).toHaveCount(2);
});
