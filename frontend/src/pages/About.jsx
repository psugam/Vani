import React from "react";

const About = () => {
  return (
    <div className="min-h-[80vh] bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Vāṇī</h1>
        <p className="text-lg text-gray-700 mb-6">
          Vāṇī is a comprehensive web application designed for students and
          enthusiasts of the Sanskrit language. Our goal is to provide a rich
          and interactive learning experience by combining classical texts with
          modern tools.
        </p>

        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Features</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2">
          <li>
            <strong>Sanskrit Readers:</strong> Read classic Sanskrit texts like
            Lanman's and Macdonnell's readers with ease.
          </li>
          <li>
            <strong>Interactive Dictionary:</strong> Click on any Devanagari
            word to get its meaning from our comprehensive dictionary.
          </li>
          <li>
            <strong>Dictionary Search:</strong> Search for words in our
            dictionary using IAST transliteration.
          </li>
          <li>
            <strong>Transliteration Tool:</strong> Convert text between various
            Indian scripts and transliteration schemes.
          </li>
          <li>
            <strong>Footnote Support:</strong> View footnotes in context without
            losing your place in the text.
          </li>
        </ul>

        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Technologies Used
        </h2>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2">
          <li>
            <strong>Frontend:</strong> React, Vite, Tailwind CSS
          </li>
          <li>
            <strong>Backend:</strong> Node.js, Express
          </li>
          <li>
            <strong>Database:</strong> MongoDB
          </li>
        </ul>

        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Contact</h2>
        <p className="text-lg text-gray-700">
          Have questions or feedback? We'd love to hear from you. Please reach
          out to us at{" "}
          <a
            href="mailto:pokharelsugam19@gmail.com"
            className="text-blue-600 hover:underline"
          >
            pokharelsugam19@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default About;
