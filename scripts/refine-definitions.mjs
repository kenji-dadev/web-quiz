import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wordsPath = resolve(__dirname, "../src/data/words.json");

const CONCURRENCY = 8;
const SAVE_EVERY = 100;

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function getLookupCandidates(word) {
  const base = word.toLowerCase().trim();
  const candidates = [base];

  if (base.includes("-")) {
    candidates.push(base.replace(/-/g, " "));
    candidates.push(base.replace(/-/g, ""));
  }

  return [...new Set(candidates)];
}

function getPosMatchers(pos) {
  const posHint = pos.toLowerCase();
  const matchers = [];

  if (posHint.includes("verb")) {
    matchers.push("verb", "v");
  }
  if (posHint.includes("noun")) {
    matchers.push("noun", "n");
  }
  if (posHint.includes("adjective")) {
    matchers.push("adjective", "adj");
  }
  if (posHint.includes("adverb")) {
    matchers.push("adverb", "adv");
  }
  if (posHint.includes("preposition")) {
    matchers.push("preposition", "prep");
  }
  if (posHint.includes("conjunction")) {
    matchers.push("conjunction", "conj");
  }
  if (posHint.includes("pronoun")) {
    matchers.push("pronoun", "pron");
  }

  return matchers;
}

function pickBestDefinition(definitions, pos) {
  if (!definitions.length) {
    return null;
  }

  const matchers = getPosMatchers(pos);

  for (const matcher of matchers) {
    const match = definitions.find((item) => item.tag === matcher);
    if (match?.definition) {
      return match.definition;
    }
  }

  return definitions[0]?.definition ?? null;
}

function parseDatamuseDefs(defs) {
  return defs
    .map((raw) => {
      const [tag, ...rest] = raw.split("\t");
      return {
        tag: tag?.trim().toLowerCase() ?? "",
        definition: rest.join("\t").trim(),
      };
    })
    .filter((item) => item.definition);
}

async function fetchFromDatamuse(word, pos) {
  for (const candidate of getLookupCandidates(word)) {
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${encodeURIComponent(candidate)}&md=d&max=1`
    );

    if (!response.ok) {
      continue;
    }

    const data = await response.json();
    const parsed = parseDatamuseDefs(data[0]?.defs ?? []);
    const definition = pickBestDefinition(parsed, pos);
    if (definition) {
      return definition;
    }
  }

  return null;
}

async function fetchFromDictionaryApi(word, pos) {
  for (const candidate of getLookupCandidates(word)) {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(candidate)}`
    );

    if (response.status === 429) {
      await sleep(1500);
      continue;
    }

    if (!response.ok) {
      continue;
    }

    const data = await response.json();
    const definitions = data.flatMap((entry) =>
      (entry.meanings ?? []).flatMap((meaning) =>
        (meaning.definitions ?? []).map((definition) => ({
          tag: meaning.partOfSpeech,
          definition: definition.definition?.trim(),
        }))
      )
    );

    const picked = pickBestDefinition(definitions, pos);
    if (picked) {
      return picked;
    }
  }

  return null;
}

async function fetchDefinition(word, pos, existingDefinition) {
  const fromDatamuse = await fetchFromDatamuse(word, pos);
  if (fromDatamuse) {
    return fromDatamuse;
  }

  const fromDictionary = await fetchFromDictionaryApi(word, pos);
  if (fromDictionary) {
    return fromDictionary;
  }

  return existingDefinition ?? null;
}

async function processWords(words) {
  let updated = 0;

  for (let index = 0; index < words.length; index += CONCURRENCY) {
    const batch = words.slice(index, index + CONCURRENCY);

    await Promise.all(
      batch.map(async (entry) => {
        try {
          const definition = await fetchDefinition(
            entry.word,
            entry.pos ?? "",
            entry.definition
          );

          if (definition && definition !== entry.definition) {
            entry.definition = definition;
            updated += 1;
          }
        } catch (error) {
          console.error(`Failed for "${entry.word}":`, error.message);
        }
      })
    );

    const processed = Math.min(index + CONCURRENCY, words.length);
    if (processed % SAVE_EVERY === 0 || processed === words.length) {
      writeFileSync(wordsPath, JSON.stringify(words, null, 2) + "\n", "utf8");
      console.log(`Progress: ${processed}/${words.length} | updated ${updated}`);
    }

    await sleep(80);
  }

  return updated;
}

const words = JSON.parse(readFileSync(wordsPath, "utf8"));

console.log(`Refining definitions for ${words.length} words...`);
const updated = await processWords(words);

writeFileSync(wordsPath, JSON.stringify(words, null, 2) + "\n", "utf8");
console.log(`Done. Updated ${updated} definitions.`);
