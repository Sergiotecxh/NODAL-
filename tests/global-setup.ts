import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export default function globalSetup() {
  mkdirSync(resolve("artifacts"), { recursive: true });
  writeFileSync(resolve("artifacts/accessibility.jsonl"), "");
}
