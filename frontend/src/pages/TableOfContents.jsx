import React from 'react'
import axios from 'axios'
import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'


const TableOfContents = () => {
  const [tocData, setTocData]=useState(null);

  const API_URL=import.meta.env.VITE_ALL_CHAPTERS_URL;
    useEffect(() => {
      const fetchChapter = async () => {
        try {
          const res = await axios.get(API_URL);
          if (res.status !== 200) throw new Error("Failed to fetch data");
          const data =  res.data;
          setTocData(data);
          // console.log(data);
         
        } catch (err) {
         console.log(err.message)
        } 
      };
      fetchChapter();
    }, [API_URL]);

  return (
    <>
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md min-w-[50%] min-h-[50%]">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6 text-center">
         Table of Contents
        </h2>
        <div className="text-gray-600 text-center text-xl">
          {
            tocData ? (
              tocData.map((chapter)=>(
                <div key={chapter._id} className="mb-2"> 
                  <Link to ={`/lanman/chapter/${chapter.serialNumber}`} className="text-blue-600 hover:underline">Chapter {chapter.serialNumber}: {chapter.title}</Link>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )
          }
        </div>
      </div>
    </div>
    </>
  )
}

export default TableOfContents