import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, "vocabulary-input.txt");
const outputPath = join(__dirname, "../src/data/words.json");

const text = readFileSync(inputPath, "utf8");
const lines = text.split(/\r?\n/);
const words = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("หมวด ")) {
    continue;
  }

  const match = trimmed.match(/^(.+?)\s+แปลว่า\s+(.*)$/);
  if (!match) {
    continue;
  }

  const word = match[1].trim();
  let meaning = match[2].trim();

  // Remove accidental path suffix on last line
  meaning = meaning.replace(/\/Users\/.*$/, "").trim();
  // Fix typo: trailing Latin letter after Thai (e.g. "ขาดa" -> "ขาด")
  meaning = meaning.replace(/[\u0E00-\u0E7F]+[a-zA-Z]+$/, (m) =>
    m.replace(/[a-zA-Z]+$/, "")
  );

  if (!word || !meaning) {
    continue;
  }

  words.push({ word, meaning });
}

writeFileSync(outputPath, JSON.stringify(words, null, 2) + "\n", "utf8");

console.log(`Parsed ${words.length} words -> ${outputPath}`);
