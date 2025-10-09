import React, { useState, useEffect } from "react";
import Sanscript from "@indic-transliteration/sanscript";
import axios from "axios";

const DevanagariWordPopup = ({ word, onClose }) => {
  if (!word) return null;

  const iastWord = Sanscript.t(word, "devanagari", "iast");
  const [meanings, setMeanings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dictionary meaning
  useEffect(() => {
    const fetchMeaning = async () => {
      const fetch_url=`${import.meta.env.VITE_MW_DICT_URL}/${iastWord}`
      // console.log(fetch_url)
      try {
        const res = await axios.get(
          fetch_url
        );
        setMeanings(res.data); // Only the data array
      } catch (err) {
        console.log("Error fetching meaning:", err);
        setMeanings([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchMeaning();
  }, [iastWord]);
  // useEffect(()=>{
  //   console.log(meanings)
  // }, [meanings])

  return (
    <div
      className="fixed inset-0 bg-opacity-10 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 rounded-3xl shadow-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border-2 border-gray-400"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{iastWord}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="text-gray-600 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Word Details</h3>
            <p className="text-sm">
              Selected Devanagari word:{" "}
              <span className="font-medium">{word}</span>
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Definition</h3>
            {loading ? (
              <p className="text-sm">Loading...</p>
            ) : meanings && meanings.length > 0 ? (
              meanings.map((entry, i) => (
                <div key={i} className="mb-2">
                  {entry.senses?.map((sense, j) => (
                    <p key={j} className="text-sm">
                      {sense.type ? `${sense.type} ` : ""}
                      {sense.meaning}
                    </p>
                  ))}

                  {entry.related_entries?.length > 0 && (
                    <div className="ml-4 mt-1">
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Related Entries:
                      </h4>
                      {entry.related_entries.map((re, k) => (
                        <div key={k} className="text-sm ml-2">
                          <p className="font-medium">{re.headword}</p>
                          {re.senses?.map((s, l) => (
                            <p key={l}>
                              {s.type ? `${s.type} ` : ""}
                              {s.meaning}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm">No meanings found.</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-1">
              Additional Information
            </h3>
            <p className="text-sm">
              You can include etymology, usage examples, or other linguistic
              notes here.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DevanagariWordPopup;
