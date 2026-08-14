import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wordsPath = resolve(__dirname, "../src/data/words.json");

const patches = {
  against: "In opposition to; touching or leaning upon.",
  anyone: "Any person; anybody.",
  captain: "The person in command of a ship, aircraft, or team.",
  from: "Indicating the point in space or time at which a journey, motion, or action starts.",
  herself:
    "(reflexive) Used as the object of a verb or preposition when the female subject is also the object.",
  itself:
    "(reflexive) Used as the object when the same thing is both subject and object.",
  "n’t":
    "Contraction of not, used to form negatives (as in can't, don't, won't).",
  please: "Used to make a polite request; to make someone happy or satisfied.",
  politician:
    "A person active in party politics, especially as a holder of or candidate for an elected office.",
  workshop:
    "A room or building where work is done; a meeting for discussion or training.",
  yourself: "(reflexive) Used as the object when you are also the subject.",
};

const words = JSON.parse(readFileSync(wordsPath, "utf8"));

for (const entry of words) {
  if (patches[entry.word]) {
    entry.definition = patches[entry.word];
  }
}

writeFileSync(wordsPath, JSON.stringify(words, null, 2) + "\n", "utf8");

const missing = words.filter((entry) => !entry.definition);
console.log(`Patched definitions. Still missing: ${missing.length}`);
