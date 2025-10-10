import React, { useState } from "react";
import Sanscript from "@indic-transliteration/sanscript";
import startCase from '@stdlib/string-startcase';


// for the sanscript conversion option both input and output
const schemes = [
  "devanagari",
  "bengali",
  "gujarati",
  "gurmukhi",
  "kannada",
  "malayalam",
  "oriya",
  "tamil",
  "telugu",
  "hk",
  "iast",
  "itrans",
  "itrans_dravidian",
  "kolkata",
  "slp1",
  "velthuis",
  "wx",
];

export default function Transliterate() {

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
//   default devanagari to iast
  const [fromScheme, setFromScheme] = useState("devanagari");
  const [toScheme, setToScheme] = useState("iast");

  // checking input. If wrong script popup shows
  const detectScript = (text) => {
    if (!text) return null;
    const c = text.trim()[0];
    const code = c.charCodeAt(0);

    // these are from the unicode representations for each script, works on more or less all cases. there are some exceptions.
    if (code >= 0x0900 && code <= 0x097f) return "devanagari";
    if (code >= 0x0980 && code <= 0x09ff) return "bengali";
    if (code >= 0x0a80 && code <= 0x0aff) return "gujarati";
    if (code >= 0x0a00 && code <= 0x0a7f) return "gurmukhi";
    if (code >= 0x0b80 && code <= 0x0bff) return "tamil";
    if (code >= 0x0c00 && code <= 0x0c7f) return "telugu";
    if (code >= 0x0c80 && code <= 0x0cff) return "kannada";
    if (code >= 0x0d00 && code <= 0x0d7f) return "malayalam";
    if (code >= 0x0b00 && code <= 0x0b7f) return "oriya";
    if (/[a-zA-Z]/.test(c)) return "roman";
    return "unknown";
  };


//   for danda and double danda some more tinckering is needed. Danda is converted wrrongly to |.
  const handleTransliterate = () => {
    if (!inputText.trim()) {
      alert("Please enter some text first.");
      return;
    }

    // wrong input and script choice

    const detected = detectScript(inputText);
    if (detected !== fromScheme && !(detected === "roman" && isRomanScheme(fromScheme))) {
      alert(
        `ERROR:\n The detected input script seems to be "${startCase(detected)}", but you selected "${startCase(fromScheme)}".\n\nPlease correct the input or change the script selection.`
      );
      return;
    }

    // the conversion happens here.
    const result = Sanscript.t(inputText, fromScheme, toScheme);
    setOutputText(result);
  };



  // Check if a scheme is Roman
  const isRomanScheme = (scheme) =>
    ["hk", "iast", "itrans", "itrans_dravidian", "kolkata", "slp1", "velthuis", "wx"].includes(scheme);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Sanskrit Transliteration Tool
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input wordbox  */}
        {/* implement box size and input limit here */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Input ({startCase(fromScheme)})
            
          </label>
          {/* dropdown select */}
          <select
            value={fromScheme}
            onChange={(e) => 
                setFromScheme(e.target.value)
            }
            className="w-full p-2 mb-4 border rounded-md"
          >
            {schemes.map((scheme) => (
              <option key={scheme} value={scheme}>
                {scheme}
              </option>
            ))}
          </select>

          <textarea
            value={inputText}
            onChange={(e) => 
                setInputText(e.target.value)
            }
            className="w-full h-48 p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter text here..."
          />

          <button
            onClick={handleTransliterate}
            className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-800 ml-4 cursor-pointer"
          >
            Transliterate
          </button>
{/* clear both input and output */}
          <button
            onClick={() => {
              setInputText("");
              setOutputText("");
            }}
            className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-800 ml-4 cursor-pointer"
          >
            Clear
          </button>

        </div>

        {/* Output section */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Output ({startCase(toScheme)})
          </label>
          <select
            value={toScheme}
            onChange={(e) => setToScheme(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          >
            {schemes.map((scheme) => (
              <option key={scheme} value={scheme}>
                {scheme}
              </option>
            ))}
          </select>
          <textarea
            readOnly
            value={outputText}
            className="w-full h-48 p-3 border rounded-md bg-gray-50"
            placeholder="Transliterated output will appear here..."
          />
        
        <button
            onClick={() => {
              navigator.clipboard.writeText(outputText);
              alert('Copied')
            }}
            className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-800 ml-4 cursor-pointer"
          >
            Copy
          </button>

        </div>
      </div>
    </div>
  );
}
