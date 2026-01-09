import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Helper to convert Roman Numerals to Integers for sorting
const romanToInt = (roman) => {
  const romanMap = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let s = roman.toUpperCase();
  for (let i = 0; i < s.length; i++) {
    const current = romanMap[s[i]];
    const next = romanMap[s[i + 1]];
    if (next > current) {
      total += next - current;
      i++;
    } else {
      total += current;
    }
  }
  return total;
};

const MacdonnellTableOfContents = () => {
  const [tocData, setTocData] = useState(null);

  const API_URL = import.meta.env.VITE_ALL_CHAPTERS_URL_MACDONNELL;

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.status !== 200) throw new Error("Failed to fetch data");

        const data = res.data;

        // --- SORTING LOGIC START ---
        const sortedData = [...data].sort((a, b) => {
          const sA = String(a.serialNumber);
          const sB = String(b.serialNumber);

          const isANumeric = /^\d/.test(sA);
          const isBNumeric = /^\d/.test(sB);

          // 1. Real numbers (Arabic) always come before Roman numerals
          if (isANumeric && !isBNumeric) return -1;
          if (!isANumeric && isBNumeric) return 1;

          // 2. If both are Real numbers (e.g., "1.1", "2", "10")
          if (isANumeric && isBNumeric) {
            return sA.localeCompare(sB, undefined, {
              numeric: true,
              sensitivity: "base",
            });
          }

          // 3. If both are Roman Numerals (e.g., "IV", "X")
          const isARoman = /^[IVXLCDM]+$/i.test(sA);
          const isBRoman = /^[IVXLCDM]+$/i.test(sB);

          if (isARoman && isBRoman) {
            return romanToInt(sA) - romanToInt(sB);
          }

          // Fallback for any other strings
          return sA.localeCompare(sB);
        });
        // --- SORTING LOGIC END ---

        setTocData(sortedData);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchChapter();
  }, [API_URL]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Macdonnell's Sanskrit Reader
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          A selection of classical texts for students of Sanskrit, with
          extensive annotations and linguistic commentary.
        </p>

        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Table of Contents
        </h2>
        <div className="text-gray-600 text-lg">
          {tocData ? (
            <ul className="space-y-4">
              {tocData.map((chapter) => (
                <li key={chapter._id} className="border-b pb-2">
                  <Link
                    to={`/macdonnell/chapter/${chapter.serialNumber}`}
                    className="text-blue-600 hover:underline"
                  >
                    <span className="font-semibold">
                      Chapter {chapter.serialNumber}:
                    </span>{" "}
                    {chapter.title}
                  </Link>
                  <p className="text-base text-gray-600 ml-4">
                    {chapter.description}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MacdonnellTableOfContents;
