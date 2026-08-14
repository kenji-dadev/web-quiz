import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wordsPath = resolve(__dirname, "../src/data/words.json");

const CONCURRENCY = 5;
const SAVE_EVERY = 50;

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

function pickDefinitionForPos(definitions, pos) {
  if (!definitions.length) {
    return null;
  }

  const posHint = pos.toLowerCase();
  const posMatchers = [];

  if (posHint.includes("verb")) {
    posMatchers.push("verb");
  }
  if (posHint.includes("noun")) {
    posMatchers.push("noun");
  }
  if (posHint.includes("adjective")) {
    posMatchers.push("adjective", "adj");
  }
  if (posHint.includes("adverb")) {
    posMatchers.push("adverb", "adv");
  }
  if (posHint.includes("preposition")) {
    posMatchers.push("preposition");
  }
  if (posHint.includes("conjunction")) {
    posMatchers.push("conjunction");
  }

  for (const matcher of posMatchers) {
    const match = definitions.find((item) => item.partOfSpeech === matcher);
    if (match?.definition) {
      return match.definition;
    }
  }

  return definitions[0]?.definition ?? null;
}

async function fetchFromDictionaryApi(word) {
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
          partOfSpeech: meaning.partOfSpeech,
          definition: definition.definition?.trim(),
        }))
      )
    );

    const picked = definitions.find((item) => item.definition);
    if (picked?.definition) {
      return picked.definition;
    }
  }

  return null;
}

function parseDatamuseDefinition(raw) {
  const parts = raw.split("\t");
  return parts[parts.length - 1]?.trim() ?? "";
}

function pickDatamuseDefinition(defs, pos) {
  const parsed = defs
    .map((raw) => {
      const [tag, ...rest] = raw.split("\t");
      return {
        tag: tag?.trim().toLowerCase() ?? "",
        definition: rest.join("\t").trim(),
      };
    })
    .filter((item) => item.definition);

  if (!parsed.length) {
    return null;
  }

  const posHint = pos.toLowerCase();
  const tagMatchers = [];

  if (posHint.includes("verb")) {
    tagMatchers.push("v");
  }
  if (posHint.includes("noun")) {
    tagMatchers.push("n");
  }
  if (posHint.includes("adjective")) {
    tagMatchers.push("adj");
  }
  if (posHint.includes("adverb")) {
    tagMatchers.push("adv");
  }
  if (posHint.includes("preposition")) {
    tagMatchers.push("prep");
  }
  if (posHint.includes("conjunction")) {
    tagMatchers.push("conj");
  }

  for (const matcher of tagMatchers) {
    const match = parsed.find((item) => item.tag === matcher);
    if (match) {
      return match.definition;
    }
  }

  return parsed[0].definition;
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
    const defs = data[0]?.defs;
    if (!defs?.length) {
      continue;
    }

    const definition = pickDatamuseDefinition(defs, pos);
    if (definition) {
      return definition;
    }
  }

  return null;
}

async function fetchDefinition(word, pos) {
  const fromDictionary = await fetchFromDictionaryApi(word);
  if (fromDictionary) {
    return fromDictionary;
  }

  await sleep(100);
  return fetchFromDatamuse(word, pos);
}

async function processWords(words) {
  let fetched = 0;
  let failed = 0;
  const failures = [];

  for (let index = 0; index < words.length; index += CONCURRENCY) {
    const batch = words.slice(index, index + CONCURRENCY);

    await Promise.all(
      batch.map(async (entry) => {
        if (entry.definition) {
          return;
        }

        try {
          const definition = await fetchDefinition(entry.word, entry.pos ?? "");
          if (definition) {
            entry.definition = definition;
            fetched += 1;
          } else {
            failed += 1;
            failures.push(entry.word);
          }
        } catch (error) {
          failed += 1;
          failures.push(entry.word);
          console.error(`Failed for "${entry.word}":`, error.message);
        }
      })
    );

    const processed = Math.min(index + CONCURRENCY, words.length);
    if (processed % SAVE_EVERY === 0 || processed === words.length) {
      writeFileSync(wordsPath, JSON.stringify(words, null, 2) + "\n", "utf8");
      console.log(
        `Progress: ${processed}/${words.length} | added ${fetched} | missing ${failed}`
      );
    }

    await sleep(120);
  }

  return { fetched, failed, failures };
}

const words = JSON.parse(readFileSync(wordsPath, "utf8"));
const missingBefore = words.filter((entry) => !entry.definition).length;

console.log(`Fetching definitions for ${missingBefore} words...`);

const { fetched, failed, failures } = await processWords(words);

writeFileSync(wordsPath, JSON.stringify(words, null, 2) + "\n", "utf8");

console.log(`Done. Added ${fetched} definitions. Still missing: ${failed}.`);
if (failures.length) {
  console.log("Missing words:", failures.join(", "));
}
