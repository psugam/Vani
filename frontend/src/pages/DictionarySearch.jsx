import React, { useState } from 'react';
import axios from 'axios'
import DictionaryResults from '../components/DictionaryResults';

function DictionarySearch() {
  const [inputValue, setInputValue] = useState('');
  const [dictionaryEntry, setDictionaryEntry]=useState(null)

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior (page reload)
    // alert(`Submitted value: ${inputValue}`);
    const dictionary_search_api_uri=`${import.meta.env.VITE_ALL_DICT_URL}/${inputValue}`
    try{
       const res= await axios.get(dictionary_search_api_uri);
       setDictionaryEntry(res.data)
      //  console.log(res.data)
    }catch(error){
        console.log(error)
        setDictionaryEntry("")
    }
    setInputValue(''); // Clears the input field after submission search nothing.
  };
  

  return (
  <>
  <div className="min-h-[80vh] flex flex-col">
    {!dictionaryEntry ? (
      // Vertically center the form when no results
      <div className="flex flex-1 justify-center items-center">
        <form onSubmit={handleSubmit} className="flex flex-col items-center p-4 space-y-4">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Enter search word here..."
            className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
          <div className="text-gray-500 text-center">
            Please enter the search word in iast format. <br />
            Other scripts and transliterations will not work. Transliterate your word{" "}
            <a href="/transliterate" className="underline">
              here
            </a>.
          </div>
        </form>
      </div>
    ) : (
      // If results exist, show form at top and results below
      <>
        <form onSubmit={handleSubmit} className="flex flex-col items-center p-4 space-y-4">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Enter search word here..."
            className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
          <div className="text-gray-500 text-center">
            Please enter the search word in iast format. <br />
            Other scripts and transliterations will not work. Transliterate your word{" "}
            <a href="/transliterate" className="underline">
              here
            </a>.
          </div>
        </form>
        <div className="flex-1 mt-4">
          <DictionaryResults data={dictionaryEntry} />
        </div>
      </>
    )}
  </div>
</>

  );
}

export default DictionarySearch;