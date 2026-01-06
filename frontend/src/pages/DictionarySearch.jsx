import React, { useState } from "react";
import axios from "axios";
import Button from "../components/common/Button";

function DictionarySearch() {
  const [inputValue, setInputValue] = useState("");
  const [dictionaryResults, setDictionaryResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper to map backend shortcodes to readable names
  const sourceMap = {
    mw: "Monier-Williams",
    ap90: "Apte",
    cae: "Cappeller",
    bhs: "Buddhist Hybrid Sanskrit",
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // API endpoint provided: http://psugam-sanskrit-parser-api.hf.space/meaning
    const apiUrl = `http://psugam-sanskrit-parser-api.hf.space/meaning?word=${encodeURIComponent(
      inputValue
    )}`;

    try {
      const { data } = await axios.get(apiUrl);
      setDictionaryResults(data); // This is now an array of grouped objects
    } catch (error) {
      console.error("Error fetching meaning:", error);
      setDictionaryResults([]);
    } finally {
      setLoading(false);
      setInputValue("");
    }
  };

  // Helper to safely render text containing HTML tags from the dictionary
  const renderDefinition = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <div className="flex flex-col py-8 md:py-12 max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center p-4 space-y-4"
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter Sanskrit word (IAST/SLP1)..."
          className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" disabled={!inputValue || loading}>
          {loading ? "Searching..." : "Search Meaning"}
        </Button>
        <div className="text-gray-500 text-sm text-center">
          Note: This search uses the integrated Sanskrit Parser API.
        </div>
      </form>

      <div className="mt-8 px-4 space-y-6">
        {dictionaryResults && dictionaryResults.length > 0 ? (
          dictionaryResults.map((entry, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden"
            >
              {/* Header: Stem and Type */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h3 className="text-xl font-bold text-blue-900">
                    {entry.stem}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase">
                    {entry.type}
                  </span>
                </div>

                {/* Grammar Tags (Cases/Numbers/Tense) */}
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

              {/* Definitions grouped by Dictionary Source */}
              <div className="p-5 space-y-6">
                {Object.entries(entry.definitions).map(
                  ([source, sentences]) => (
                    <div key={source} className="space-y-2">
                      <h4 className="text-sm font-bold text-orange-800 border-b border-orange-100 pb-1">
                        {sourceMap[source] || source.toUpperCase()}
                      </h4>
                      <ul className="list-disc ml-5 space-y-2">
                        {sentences.map((sentence, sIdx) => (
                          <li
                            key={sIdx}
                            className="text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={renderDefinition(sentence)}
                          />
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          ))
        ) : dictionaryResults && dictionaryResults.length === 0 ? (
          <div className="text-center py-10 text-gray-500 italic">
            No meanings found for this word.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DictionarySearch;
