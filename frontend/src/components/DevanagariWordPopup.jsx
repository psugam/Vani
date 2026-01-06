import React, { useState, useEffect } from "react";
import Sanscript from "@indic-transliteration/sanscript";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_PARSER_API || "http://localhost:3000/api/parse";

const DevanagariWordPopup = ({ word, onClose }) => {
  if (!word) return null;

  const iastWord = Sanscript.t(word, "devanagari", "iast");
  const [analysis, setAnalysis] = useState({
    isCompound: false,
    components: [],
  });
  const [activeComponent, setActiveComponent] = useState(word);
  const [meanings, setMeanings] = useState([]);
  const [loading, setLoading] = useState(true);

  const sourceNames = {
    mw: "Monier-Williams",
    ap90: "Apte",
    cae: "Cappeller",
    bhs: "Buddhist Hybrid Sanskrit",
  };

  /**
   * Matches the cleaning logic from DictionarySearch
   */
  const formatDictHTML = (html) => {
    if (!html) return "";
    return html
      .replace(/<s>/gi, '<span class="skt-text">')
      .replace(/<\/s>/gi, "</span>")
      .replace(/<ab[^>]*>/gi, '<span class="dict-abbrev">')
      .replace(/<\/ab>/gi, "</span>")
      .replace(/<ls[^>]*>/gi, '<span class="dict-source">')
      .replace(/<\/ls>/gi, "</span>")
      .replace(/<lex[^>]*>/gi, '<span class="dict-lex">')
      .replace(/<\/lex>/gi, "</span>")
      .replace(/<div n="1"\/>/g, "")
      .replace(/<lbinfo[^>]*\/>/g, " ")
      .replace(/<(?!\/?span\b)[^>]+>/gi, ""); // Remove unknown structural tags
  };

  useEffect(() => {
    const initAnalysis = async () => {
      setLoading(true);
      try {
        const { data: splitData } = await axios.get(
          `${API_BASE}/split?word=${encodeURIComponent(word)}`
        );
        setAnalysis({
          isCompound: splitData.is_compound,
          components: splitData.components,
        });

        const target = splitData.components[0] || word;
        setActiveComponent(target);
        await fetchMeaning(target);
      } catch (err) {
        console.error("Analysis error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAnalysis();
  }, [word]);

  const fetchMeaning = async (targetWord) => {
    setLoading(true);
    setActiveComponent(targetWord);
    try {
      const { data } = await axios.get(
        `${API_BASE}/meaning?word=${encodeURIComponent(targetWord)}`
      );
      setMeanings(data);
    } catch (err) {
      console.error("Meaning error:", err);
      setMeanings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      {/* Custom Styles inherited from DictionarySearch */}
      <style>{`
        .skt-text { color: #1e4d6b; font-style: italic; font-family: serif; font-weight: 500; }
        .dict-abbrev { color: #6b7280; font-variant: small-caps; font-weight: 600; font-size: 0.95em; }
        .dict-source { color: #059669; font-size: 0.9em; background-color: #f0fdf4; padding: 0 2px; border-radius: 2px; }
        .dict-lex { color: #7c3aed; font-weight: bold; font-style: normal; }
      `}</style>

      <div
        className="bg-[#faf8f3] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-serif text-slate-800">{word}</h2>
            <p className="text-lg text-slate-500 italic">{iastWord}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Compound UI */}
          {analysis.isCompound && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Compound Components
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.components.map((comp, i) => (
                  <button
                    key={i}
                    onClick={() => fetchMeaning(comp)}
                    className={`px-4 py-1.5 rounded-full border transition-all ${
                      activeComponent === comp
                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-400"
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meaning Results mapped to DictionarySearch presentation */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center py-10 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 animate-pulse">
                  Analyzing morphology...
                </p>
              </div>
            ) : meanings.length > 0 ? (
              meanings.map((entry, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <h3 className="text-xl font-bold text-blue-900">
                        {entry.stem}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase">
                        {entry.type}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {entry.detected_tags.map((tagSet, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded"
                        >
                          {tagSet.join(", ")}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Definitions */}
                  <div className="p-5 space-y-6">
                    {Object.entries(entry.definitions).map(
                      ([source, sentences]) => (
                        <div key={source} className="space-y-2">
                          <h4 className="text-sm font-bold text-orange-800 border-b border-orange-100 pb-1 uppercase tracking-wider">
                            {sourceNames[source] || source.toUpperCase()}
                          </h4>
                          <ul className="list-none space-y-3">
                            {sentences.map((sentence, sIdx) => (
                              <li
                                key={sIdx}
                                className="text-gray-700 leading-relaxed text-[15px] font-serif"
                                dangerouslySetInnerHTML={{
                                  __html: `• ${formatDictHTML(sentence)}`,
                                }}
                              />
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 italic">
                  No exact dictionary matches found for "{activeComponent}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-black text-white rounded-lg font-medium transition-colors"
          >
            Close the Popup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevanagariWordPopup;
