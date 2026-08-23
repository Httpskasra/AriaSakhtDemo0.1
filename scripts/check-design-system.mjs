import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sourceRoots = ["assets", "components", "layouts", "pages"];
const sourceExtensions = new Set([".vue", ".css", ".scss", ".sass", ".less"]);
const rawColorPattern = /#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(/g;
const importantPattern = /!important\b/g;
const genericContainerPattern = /(?:^|[\s"'])container(?:[\s"']|$)/;
const tokenDeclarationPattern = /(?:box-shadow|border-radius)\s*:\s*([^;{}]+)/g;

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (["node_modules", ".nuxt", ".output"].includes(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (sourceExtensions.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

const files = (await Promise.all(sourceRoots.map((sourceRoot) => walk(path.join(root, sourceRoot))))).flat();
const violations = [];

for (const file of files) {
  const relative = path.relative(root, file);
  const source = await fs.readFile(file, "utf8");
  const isTokenFile = relative === "assets/css/main.css";
  const styles = path.extname(file) === ".vue"
    ? [...source.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)].map((match) => ({ text: match[1], offset: match.index ?? 0 }))
    : [{ text: source, offset: 0 }];

  if (!isTokenFile) {
    for (const match of source.matchAll(rawColorPattern)) {
      violations.push(`${relative}:${lineNumber(source, match.index)} رنگ مستقیم؛ از Token طراحی استفاده کنید (${match[0]})`);
    }
    for (const match of source.matchAll(importantPattern)) {
      violations.push(`${relative}:${lineNumber(source, match.index)} استفاده از !important ممنوع است`);
    }
    if (genericContainerPattern.test(source)) {
      const index = source.search(genericContainerPattern);
      violations.push(`${relative}:${lineNumber(source, index)} کلاس عمومی container ممنوع است`);
    }
  }

  for (const style of styles) {
    for (const match of style.text.matchAll(tokenDeclarationPattern)) {
      const value = match[1].trim();
      if (!value.includes("var(--")) {
        violations.push(`${relative}:${lineNumber(source, style.offset + (match.index ?? 0))} مقدار ${match[0].split(":")[0]} باید از Token استفاده کند (${value})`);
      }
    }

  }
}

if (violations.length) {
  console.error("Design-system lint failed:\n" + violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Design-system lint passed (${files.length} source files checked).`);
}
