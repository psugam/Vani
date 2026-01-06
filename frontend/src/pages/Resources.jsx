import React from "react";

const resources = [
  {
    category: "Online Dictionaries",
    items: [
      {
        title: "Monier-Williams Sanskrit-English Dictionary",
        url: "https://www.sanskrit-lexicon.uni-koeln.de/scans/MW72/index.php",
        description:
          "A comprehensive and widely used Sanskrit-English dictionary.",
      },
      {
        title: "Apte's Practical Sanskrit-English Dictionary",
        url: "https://www.sanskrit-lexicon.uni-koeln.de/scans/AP90/index.php",
        description: "A practical dictionary for students and scholars.",
      },
    ],
  },
  {
    category: "Grammar Resources",
    items: [
      {
        title: "The Sanskrit Grammarian",
        url: "https://sanskritgrammarian.com/",
        description:
          "A website dedicated to the study of Sanskrit grammar, with a focus on Pāṇini's Aṣṭādhyāyī.",
      },
    ],
  },
  {
    category: "Tools and Software",
    items: [
      {
        title: "Sanskrit Heritage Site",
        url: "https://sanskrit.inria.fr/",
        description:
          "A collection of tools for Sanskrit processing, including a sandhi-splutter and a morphological analyzer.",
      },
    ],
  },
  {
    category: "Other Useful Links",
    items: [
      {
        title: "The Sanskrit Documents Site",
        url: "https://sanskritdocuments.org/",
        description:
          "A large collection of Sanskrit texts in various formats.",
      },
    ],
  },
];

const Resources = () => {
  return (
    <div className="min-h-[80vh] bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sanskrit Resources
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          A curated list of useful resources for Sanskrit learners.
        </p>

        {resources.map((section) => (
          <div key={section.category} className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              {section.category}
            </h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-4">
              {section.items.map((item) => (
                <li key={item.title}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.title}
                  </a>
                  <p className="text-base text-gray-600 ml-4">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;