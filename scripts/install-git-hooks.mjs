#!/usr/bin/env node

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const hooksPath = ".githooks";
const hookDir = resolve(process.cwd(), hooksPath);

if (!existsSync(hookDir)) {
  console.error(`Missing ${hooksPath} directory at ${hookDir}.`);
  process.exit(1);
}

execSync(`git config core.hooksPath ${hooksPath}`, { stdio: "inherit" });
console.log(`Git hooks installed. core.hooksPath -> ${hooksPath}`);
