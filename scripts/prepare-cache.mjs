import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const sourceDist = path.join(root, "node_modules", "electron", "dist");
const targetRoot = path.join(root, "build-cache", "electron");
const targetDist = path.join(targetRoot, "dist");

async function main() {
  if (!existsSync(sourceDist)) {
    throw new Error(
      `找不到 Electron 发行包：${sourceDist}。请先执行 npm install，再运行 npm run cache:prepare。`,
    );
  }

  await rm(targetDist, { recursive: true, force: true });
  await mkdir(targetDist, { recursive: true });
  execFileSync("ditto", [sourceDist, targetDist], { stdio: "inherit" });

  const versionPath = path.join(sourceDist, "version");
  if (existsSync(versionPath)) {
    const version = (await readFile(versionPath, "utf8")).trim();
    await writeFile(path.join(targetRoot, "version.txt"), `${version}\n`, "utf8");
  }

  await writeFile(
    path.join(targetRoot, "README.md"),
    [
      "# Electron Cache Backup",
      "",
      "This directory stores a local backup of the Electron runtime used by the app.",
      "Run `npm run cache:prepare` after updating Electron to refresh this backup.",
      "",
    ].join("\n"),
    "utf8",
  );

  console.log(`Electron cache prepared at ${targetDist}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
