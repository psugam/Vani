import React, { useState } from "react";

export default function DictionaryResults({ data }) {
  // data = API response object (e.g. { ABCH: [...], ACC: [...], ... })
  const [openDict, setOpenDict] = useState(null);

  const toggleDict = (dict) => {
    setOpenDict(openDict === dict ? null : dict);
  };

  return (
    <div className="max-w-3xl mx-auto my-6 space-y-4">
      {Object.keys(data).map((dictKey) => (
        <div key={dictKey} className="border border-gray-300 rounded-2xl shadow-sm">
          {/* Dropdown Header */}
          <button
            onClick={() => toggleDict(dictKey)}
            className="w-full text-left p-4 font-semibold text-lg bg-gray-100 hover:bg-gray-200 rounded-t-2xl flex justify-between items-center"
          >
            <span>{dictKey}</span>
            <span className="text-gray-500">
              {openDict === dictKey ? "▲" : "▼"}
            </span>
          </button>

          {/* Dropdown Body */}
          {openDict === dictKey && (
            <div className="p-4 bg-white space-y-4">
              {data[dictKey].map((entry, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-3 shadow-sm"
                >
                  <div className="font-semibold text-blue-700 text-lg">
                    {entry.key}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    ID: {entry.id}
                  </div>
                  <div className="prose max-w-none text-gray-800">
                    {/* Render HTML content safely */}
                    <div
                      dangerouslySetInnerHTML={{ __html: entry.data }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
