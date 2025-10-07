import React from 'react';

const DevanagariWordPopup = ({ word, onClose }) => {
  if (!word) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {word}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="text-gray-600 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Word Details</h3>
            <p className="text-sm">
              Selected Devanagari word: <span className="font-medium">{word}</span>
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Definition</h3>
            <p className="text-sm">
              This is placeholder text for the definition. You can replace this with actual dictionary data, translations, or explanations.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Additional Information</h3>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Add any relevant linguistic information, etymology, or usage examples here.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DevanagariWordPopup;