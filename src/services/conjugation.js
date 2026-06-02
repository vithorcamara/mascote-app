/**
 * Portuguese Verb Conjugation Service
 * Handles regular -ar, -er, -ir verbs and common irregular verbs.
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

/**
 * Special cases and irregular verbs overrides
 */
const irregularVerbs = {
  "dormir": {
    present: ["durmo", "dorme", "dorme", "dormimos", "dormem", "dormem"]
  },
  "vestir": {
    present: ["visto", "veste", "veste", "vestimos", "vestem", "vestem"]
  },
  "ler": {
    present: ["leio", "lê", "lê", "lemos", "leem", "leem"],
    past: ["li", "leu", "leu", "lemos", "leram", "leram"]
  },
  "ouvir": {
    present: ["ouço", "ouve", "ouve", "ouvimos", "ouvem", "ouvem"]
  },
  "pedir": {
    present: ["peço", "pede", "pede", "pedimos", "pedem", "pedem"]
  },
  "fazer": {
    present: ["faço", "faz", "faz", "fazemos", "fazem", "fazem"],
    past: ["fiz", "fez", "fez", "fizemos", "fizeram", "fizeram"],
    future: ["farei", "fará", "fará", "faremos", "farão", "farão"]
  },
  "trazer": {
    present: ["trago", "traz", "traz", "trazemos", "trazem", "trazem"],
    past: ["trouxe", "trouxe", "trouxe", "trouxemos", "trouxeram", "trouxeram"],
    future: ["trarei", "trará", "trará", "traremos", "trarão", "trarão"]
  },
  "ver": {
    present: ["vejo", "vê", "vê", "vemos", "veem", "veem"],
    past: ["vi", "viu", "viu", "vimos", "viram", "viram"]
  },
  "ir": {
    present: ["vou", "vai", "vai", "vamos", "vão", "vão"],
    past: ["fui", "foi", "foi", "fomos", "foram", "foram"],
    future: ["irei", "irá", "irá", "iremos", "irão", "irão"]
  },
  "querer": {
    present: ["quero", "quer", "quer", "queremos", "querem", "querem"],
    past: ["quis", "quis", "quis", "quisemos", "quiseram", "quiseram"]
  },
  "dar": {
    present: ["dou", "dá", "dá", "damos", "dão", "dão"],
    past: ["dei", "deu", "deu", "demos", "deram", "deram"]
  },
  "saber": {
    present: ["sei", "sabe", "sabe", "sabemos", "sabem", "sabem"],
    past: ["soube", "soube", "soube", "soubemos", "souberam", "souberam"]
  },
  "poder": {
    present: ["posso", "pode", "pode", "podemos", "podem", "podem"],
    past: ["pude", "pôde", "pôde", "pudemos", "puderam", "puderam"]
  },
  "ter": {
    present: ["tenho", "tem", "tem", "temos", "têm", "têm"],
    past: ["tive", "teve", "teve", "tivemos", "tiveram", "tiveram"],
    future: ["terei", "terá", "terá", "teremos", "terão", "terão"]
  },
  "vir": {
    present: ["venho", "vem", "vem", "vimos", "vêm", "vêm"],
    past: ["vim", "veio", "veio", "viemos", "vieram", "vieram"],
    future: ["virei", "virá", "virá", "viremos", "virão", "virão"]
  },
  "dizer": {
    present: ["digo", "diz", "diz", "dizemos", "dizem", "dizem"],
    past: ["disse", "disse", "disse", "dissemos", "disseram", "disseram"],
    future: ["direi", "dirá", "dirá", "diremos", "dirão", "dirão"]
  },
  "sair": {
    present: ["saio", "sai", "sai", "saímos", "saem", "saem"],
    past: ["saí", "saiu", "saiu", "saímos", "saíram", "saíram"]
  },
  "servir": {
    present: ["sirvo", "serve", "serve", "servimos", "servem", "servem"]
  },
  "valer": {
    present: ["valho", "vale", "vale", "valemos", "valem", "valem"]
  },
  "ouvir": {
    present: ["ouço", "ouve", "ouve", "ouvimos", "ouvem", "ouvem"]
  },
  "perder": {
    present: ["perco", "perde", "perde", "perdemos", "perdem", "perdem"]
  },
  "trazer": {
    present: ["trago", "traz", "traz", "trazemos", "trazem", "trazem"],
    past: ["trouxe", "trouxe", "trouxe", "trouxemos", "trouxeram", "trouxeram"],
    future: ["trarei", "trará", "trará", "traremos", "trarão", "trarão"]
  }
};

export function conjugate(subject, verbInfinitive, tense = "present") {
  if (!subject || !verbInfinitive || tense === "imperative") return verbInfinitive;

  const subjectLower = subject.toLowerCase();
  const verbLower = verbInfinitive.toLowerCase().trim();

  // Find subject index
  const subjectIndex = subjectsMap[subjectLower];
  if (subjectIndex === undefined) return verbInfinitive;

  // Check for irregular verbs first
  if (irregularVerbs[verbLower] && irregularVerbs[verbLower][tense]) {
    let result = irregularVerbs[verbLower][tense][subjectIndex];
    
    // Match original capitalization
    if (verbInfinitive[0] === verbInfinitive[0].toUpperCase()) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }
    return result;
  }

  // Regular conjugation logic
  const ending = verbLower.slice(-2);
  const stem = verbLower.slice(0, -2);

  if (!["ar", "er", "ir"].includes(ending)) return verbInfinitive;

  const tenseEndings = endings[tense];
  if (!tenseEndings) return verbInfinitive;

  const conjugatedEnding = tenseEndings[ending][subjectIndex];
  
  let result = stem + conjugatedEnding;

  // Match original capitalization
  if (verbInfinitive[0] === verbInfinitive[0].toUpperCase()) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result;
}
