import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DictionaryEntry = ({ entryWrapper }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedWord, setCopiedWord] = useState(null);
  const { dictionary, found_in, result } = entryWrapper;

  const toggleEntry = () => {
    setIsOpen(!isOpen);
  };

  const handleCopy = (word) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
  };

  useEffect(() => {
    if (copiedWord) {
      const timer = setTimeout(() => {
        setCopiedWord(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedWord]);

  return (
    <div className="border border-gray-300 rounded-2xl shadow-sm">
      <button
        onClick={toggleEntry}
        className="w-full text-left p-4 font-semibold text-lg bg-gray-100 hover:bg-gray-200 rounded-t-2xl flex justify-between items-center"
      >
        <span>
          {dictionary} ({found_in}) - {result.word_iast}
        </span>
        <span className="text-gray-500">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="p-4 bg-white space-y-4">
          <div className="font-semibold text-blue-700 text-lg">
            <span
              className="cursor-pointer"
              onClick={() => handleCopy(result.word_iast)}
            >
              {result.word_iast}
              {copiedWord === result.word_iast && (
                <span className="text-sm text-green-500 ml-2">Copied!</span>
              )}
            </span>{" "}
            (
            <span
              className="cursor-pointer"
              onClick={() => handleCopy(result.word_slp1)}
            >
              {result.word_slp1}
              {copiedWord === result.word_slp1 && (
                <span className="text-sm text-green-500 ml-2">Copied!</span>
              )}
            </span>
            )
          </div>
          {result.type && (
            <div className="text-sm text-gray-600 mb-2">
              Gender: {result.type}
            </div>
          )}

          {result.meanings?.map((meaning, mIdx) => (
            <div
              key={mIdx}
              className="border border-gray-200 rounded-xl p-3 shadow-sm"
            >
              {meaning.gender && (
                <div className="text-sm font-medium text-gray-700">
                  {meaning.gender}
                </div>
              )}
              <div className="text-gray-800">{meaning.definition}</div>
            </div>
          ))}

          {result.related?.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="font-semibold text-indigo-700">
                Related Entries:
              </div>
              {result.related.map((rel, rIdx) => (
                <div
                  key={rIdx}
                  className="border border-gray-200 rounded-xl p-3 shadow-sm"
                >
                  <div className="font-medium text-blue-600">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleCopy(rel.word_iast)}
                    >
                      {rel.word_iast}
                      {copiedWord === rel.word_iast && (
                        <span className="text-sm text-green-500 ml-2">
                          Copied!
                        </span>
                      )}
                    </span>{" "}
                    (
                    <span
                      className="cursor-pointer"
                      onClick={() => handleCopy(rel.word_slp1)}
                    >
                      {rel.word_slp1}
                      {copiedWord === rel.word_slp1 && (
                        <span className="text-sm text-green-500 ml-2">
                          Copied!
                        </span>
                      )}
                    </span>
                    )
                  </div>
                  {rel.type && (
                    <div className="text-sm text-gray-600">
                      Gender: {rel.type}
                    </div>
                  )}
                  {rel.meanings?.map((rm, rmIdx) => (
                    <div key={rmIdx} className="text-gray-800 mt-1">
                      {rm.gender && (
                        <span className="font-medium">{rm.gender}: </span>
                      )}
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
};

DictionaryEntry.propTypes = {
  entryWrapper: PropTypes.shape({
    dictionary: PropTypes.string.isRequired,
    found_in: PropTypes.string.isRequired,
    result: PropTypes.shape({
      word_iast: PropTypes.string.isRequired,
      word_slp1: PropTypes.string.isRequired,
      type: PropTypes.string,
      meanings: PropTypes.arrayOf(
        PropTypes.shape({
          gender: PropTypes.string,
          definition: PropTypes.string.isRequired,
        })
      ),
      related: PropTypes.arrayOf(
        PropTypes.shape({
          word_iast: PropTypes.string.isRequired,
          word_slp1: PropTypes.string.isRequired,
          type: PropTypes.string,
          meanings: PropTypes.arrayOf(
            PropTypes.shape({
              gender: PropTypes.string,
              definition: PropTypes.string.isRequired,
            })
          ),
        })
      ),
    }).isRequired,
  }).isRequired,
};

export default DictionaryEntry;
