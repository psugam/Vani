import React, { useState } from "react";

export default function DictionaryResults({ data }) {
  // data = API response array from your search API
  const [openIndex, setOpenIndex] = useState(null);

  const toggleEntry = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto my-6 space-y-4">
      {data.map((entryWrapper, idx) => {
        const { dictionary, found_in, result } = entryWrapper;

        return (
          <div key={idx} className="border border-gray-300 rounded-2xl shadow-sm">
            {/* Dropdown Header */}
            <button
              onClick={() => toggleEntry(idx)}
              className="w-full text-left p-4 font-semibold text-lg bg-gray-100 hover:bg-gray-200 rounded-t-2xl flex justify-between items-center"
            >
              <span>{dictionary} ({found_in}) - {result.word_iast}</span>
              <span className="text-gray-500">
                {openIndex === idx ? "▲" : "▼"}
              </span>
            </button>

            {/* Dropdown Body */}
            {openIndex === idx && (
              <div className="p-4 bg-white space-y-4">
                <div className="font-semibold text-blue-700 text-lg">
                  {result.word_iast} ({result.word_slp1})
                </div>
                {result.type && (
                  <div className="text-sm text-gray-600 mb-2">
                    Gender: {result.type}
                  </div>
                )}

                {/* Meanings */}
                {result.meanings?.map((meaning, mIdx) => (
                  <div key={mIdx} className="border border-gray-200 rounded-xl p-3 shadow-sm">
                    {meaning.gender && (
                      <div className="text-sm font-medium text-gray-700">
                        {meaning.gender}
                      </div>
                    )}
                    <div className="text-gray-800">{meaning.definition}</div>
                  </div>
                ))}

                {/* Related Entries */}
                {result.related?.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="font-semibold text-indigo-700">Related Entries:</div>
                    {result.related.map((rel, rIdx) => (
                      <div key={rIdx} className="border border-gray-200 rounded-xl p-3 shadow-sm">
                        <div className="font-medium text-blue-600">{rel.word_iast} ({rel.word_slp1})</div>
                        {rel.type && (
                          <div className="text-sm text-gray-600">Gender: {rel.type}</div>
                        )}
                        {rel.meanings?.map((rm, rmIdx) => (
                          <div key={rmIdx} className="text-gray-800 mt-1">
                            {rm.gender && <span className="font-medium">{rm.gender}: </span>}
                            {rm.definition}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
