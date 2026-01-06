import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MacdonnellTableOfContents = () => {
  const [tocData, setTocData] = useState(null);

  const API_URL = import.meta.env.VITE_ALL_CHAPTERS_URL_MACDONNELL;
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.status !== 200) throw new Error("Failed to fetch data");
        const data = res.data;
        setTocData(data);
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

