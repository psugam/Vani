import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center px-4 py-8 md:py-12">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-6 md:p-12">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Vāṇī
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Your gateway to classical Sanskrit literature.
          </p>
        </div>

        <div className="mb-10 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 text-center">
            Explore the Readers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/lanman/toc"
              className="block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                Lanman's Sanskrit Reader
              </h3>
              <p className="text-gray-600 text-sm">
                A classic introduction to Sanskrit literature.
              </p>
            </Link>

            <Link
              to="/macdonnell/toc"
              className="block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                Macdonnell's Sanskrit Reader
              </h3>
              <p className="text-gray-600 text-sm">
                A selection of texts for students of Sanskrit.
              </p>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4">
            <div className="text-3xl mb-2">📖</div>
            <h4 className="font-semibold text-gray-800 mb-1">
              <Link to="/lanman/toc">Digital Texts</Link>
            </h4>
            <p className="text-sm text-gray-600">
              Easy access to classic Sanskrit readers.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="text-3xl mb-2">🔗</div>
            <h4 className="font-semibold text-gray-800 mb-1">
              <Link to="/resources">Linked Resources</Link>
            </h4>
            <p className="text-sm text-gray-600">
              Integrated dictionary and reference tools.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="text-3xl mb-2">🔄</div>
            <h4 className="font-semibold text-gray-800 mb-1">
              <Link to="/transliterate">Transliterate</Link>
            </h4>
            <p className="text-sm text-gray-600">
              Convert text between scripts and schemes.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/lanman/toc"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Start Reading
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
