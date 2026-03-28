/**
 * Simple Portuguese Verb Conjugation Service
 * Handles regular -ar, -er, -ir verbs in Past, Present, and Future.
 */

const endings = {
  present: {
    ar: ["o", "a", "a", "amos", "am", "am"],
    er: ["o", "e", "e", "emos", "em", "em"],
    ir: ["o", "e", "e", "imos", "em", "em"]
  },
  past: {
    ar: ["ei", "ou", "ou", "amos", "aram", "aram"],
    er: ["i", "eu", "eu", "emos", "eram", "eram"],
    ir: ["i", "iu", "iu", "imos", "iram", "iram"]
  },
  future: {
    ar: ["arei", "ará", "ará", "aremos", "arão", "arão"],
    er: ["erei", "erá", "erá", "eremos", "erão", "erão"],
    ir: ["irei", "irá", "irá", "iremos", "irão", "irão"]
  }
};

const subjectsMap = {
  "eu": 0,
  "você": 1,
  "ele": 2,
  "ela": 2,
  "nós": 3,
  "vocês": 4,
  "eles": 5,
  "elas": 5
};

export function conjugate(subject, verbInfinitive, tense = "present") {
  if (!subject || !verbInfinitive || tense == "imperative") return verbInfinitive;

  const subjectLower = subject.toLowerCase();
  const verbLower = verbInfinitive.toLowerCase().trim();

  // Irregular override for "vestir" in present tense
  if (verbLower === "vestir" && tense === "present") {
    if (subjectLower === "eu") return "visto";
  }
  
  // Find subject index
  const subjectIndex = subjectsMap[subjectLower];
  if (subjectIndex === undefined) return verbInfinitive; // Return as is if subject not found

  // Identify verb ending (ar, er, ir)
  const ending = verbLower.slice(-2);
  const stem = verbLower.slice(0, -2);

  if (!["ar", "er", "ir"].includes(ending)) return verbInfinitive;

  // Get conjugated ending
  const tenseEndings = endings[tense];
  if (!tenseEndings) return verbInfinitive;

  const conjugatedEnding = tenseEndings[ending][subjectIndex];
  
  // Combine stem and ending
  let result = stem + conjugatedEnding;

  // Match original capitalization
  if (verbInfinitive[0] === verbInfinitive[0].toUpperCase()) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result;
}
