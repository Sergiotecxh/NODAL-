import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  globalSetup: "./tests/global-setup.ts",
  workers: 1,
  fullyParallel: false,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    viewport: { width: 1440, height: 1050 },
    launchOptions: {
      executablePath: "/usr/bin/chromium",
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
      ],
    },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command:
      process.env.NODAL_STATIC_TEST === "1"
        ? "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort"
        : "npm run dev -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    timeout: 60_000,
    reuseExistingServer: false,
  },
});
