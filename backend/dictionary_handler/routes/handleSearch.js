const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

async function handleSearch(dictName, searchTerm) {
  const dictPath = path.join(__dirname, "../data/sa_en", dictName);

  if (!fs.existsSync(dictPath)) {
    throw new Error(`Dictionary folder '${dictName}' not found`);
  }

  const files = fs.readdirSync(dictPath).filter(f => f.endsWith(".tei"));
  const parser = new xml2js.Parser({ explicitArray: false });
  const results = [];

  for (const file of files) {
    const filePath = path.join(dictPath, file);
    const xml = fs.readFileSync(filePath, "utf-8");
    const data = await parser.parseStringPromise(xml);

    const entries = data.TEI?.text?.body?.entry;
    if (!entries) continue;

    const entryList = Array.isArray(entries) ? entries : [entries];

    for (const entry of entryList) {
      let orthValue = extractOrth(entry.form);

      if (!orthValue) continue;

      if (orthValue.toLowerCase() === searchTerm.toLowerCase()) {
        const senses = entry.sense;
        const senseList = Array.isArray(senses) ? senses : [senses];
        const definitions = senseList
          .map(s => {
            if (typeof s === "string") return s;
            if (s._) return s._;
            if (s["#text"]) return s["#text"];
            return JSON.stringify(s);
          })
          .filter(Boolean);

        results.push({
          dictionary: dictName,
          word: orthValue,
          file,
          definitions
        });
      }
    }
  }

  return results;
}

/**
 * Safely extracts the orth text value no matter how it's nested.
 */
function extractOrth(form) {
  if (!form || !form.orth) return null;

  const orth = form.orth;

  if (typeof orth === "string") return orth;
  if (orth._) return orth._;
  if (orth["#text"]) return orth["#text"];

  // Sometimes orth is nested like orth.choice.reg
  if (orth.choice?.reg) return orth.choice.reg;
  if (Array.isArray(orth)) return orth.map(o => extractOrth({ orth: o })).join(", ");

  // If it’s an object, try converting to string
  return Object.values(orth).join(" ").trim();
}

module.exports = handleSearch;
