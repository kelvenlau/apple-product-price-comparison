import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const distPath = path.join(root, "build-cache", "electron", "dist");
const versionPath = path.join(root, "build-cache", "electron", "version.txt");
const electronVersion = readFileSync(
  path.join(root, "node_modules", "electron", "package.json"),
  "utf8",
);
const version = JSON.parse(electronVersion).version;

if (!existsSync(distPath)) {
  console.error(
    `离线缓存不存在：${distPath}\n请先执行 npm run cache:prepare，再执行打包。`,
  );
  process.exit(1);
}

if (existsSync(versionPath)) {
  const cachedVersion = readFileSync(versionPath, "utf8").trim();
  if (cachedVersion !== version) {
    console.error(
      `缓存版本与当前 Electron 版本不一致：缓存 ${cachedVersion}，当前 ${version}\n请执行 npm run cache:prepare 重新备份。`,
    );
    process.exit(1);
  }
}

console.log(`Electron cache ready: ${distPath}`);
