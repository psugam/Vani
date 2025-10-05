import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import startCase from '@stdlib/string-startcase' ;

  import parse from "html-react-parser";

const ChapterPage = () => {
  const { chapterNo } = useParams();
  const [chapter, setChapter] = useState(null);
  const [author, setAuthor] = useState("-");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredFootnote, setHoveredFootnote] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  const API_URL = `${import.meta.env.VITE_SINGLE_CHAPTER_URL}/${chapterNo}`;

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.status !== 200) throw new Error("Failed to fetch chapter");

        const data = res.data[0] || res.data;
        setChapter({
          ...data,
          footnotes: Array.isArray(data.footnotes) ? data.footnotes : [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [API_URL]);

  useEffect(() => {
    if (!chapter || !chapter.userId) return;
    const fetchAuthor = async () => {
      console.log(`${import.meta.env.VITE_AUTHOR_URL}/${chapter.userId}`)
      try {
        const authorURL=`${import.meta.env.VITE_AUTHOR_URL}/${chapter.userId}`
        const res = await axios.get(
          authorURL
        );
        setAuthor(res.data.username || "Unknown");
      } catch (err) {
        console.error("Error fetching author:", err);
        setAuthor("Unknown");
      }
    };
    fetchAuthor();
  }, [chapter]);

  const currentFootnote =
    hoveredFootnote &&
    chapter?.footnotes?.find((f) => f.number === hoveredFootnote);

// const handleFootnoteHover = (footnoteNum, event) => {
//   const rect = event.target.getBoundingClientRect();
//   const scrollY = window.scrollY || window.pageYOffset;
  
//   // Position directly below the link
//   let top = rect.bottom + scrollY + 4; // small gap
//   let left = rect.left;
  
//   setTooltipPos({ x: left, y: top });
//   setHoveredFootnote(footnoteNum);
// };



const handleFootnoteHover = (footnoteNum, event) => {
  const rect = event.target.getBoundingClientRect();
  const scrollY = window.scrollY || window.pageYOffset;
  const viewportHeight = window.innerHeight;
  
  // Calculate initial position below the link
  let top = rect.bottom + scrollY + 4;
  let left = rect.left;
  
  // Check if tooltip would go below viewport
  const tooltipHeight = 200; // approximate max height
  const spaceBelow = viewportHeight - rect.bottom;
  
  // If not enough space below, position above the link instead
  if (spaceBelow < tooltipHeight && rect.top > tooltipHeight) {
    top = rect.top + scrollY - tooltipHeight - 4;
  }
  
  // Keep tooltip within horizontal bounds
  const tooltipWidth = 384; // max-w-sm = 384px
  if (left + tooltipWidth > window.innerWidth) {
    left = window.innerWidth - tooltipWidth - 16;
  }
  
  setTooltipPos({ x: Math.max(16, left), y: top });
  setHoveredFootnote(footnoteNum);
};



  const handleFootnoteLeave = (e) => {
    setTimeout(() => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.matches(":hover") &&
        !e.target.matches(":hover")
      ) {
        setHoveredFootnote(null);
      }
    }, 150);
  };

  // const parseTextWithFootnotes = (text, footnotes) => {
  //   if (!text) return null;
  //   const regex = /\[\^(\d+)\]/g;
  //   const elements = [];
  //   let lastIndex = 0;
  //   let match;

  //   while ((match = regex.exec(text)) !== null) {
  //     const noteNumber = match[1];
  //     elements.push(text.slice(lastIndex, match.index));
  //     elements.push(
  //       <sup
  //         key={match.index}
  //         data-footnote={noteNumber}
  //         className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
  //         onMouseEnter={(e) => handleFootnoteHover(noteNumber, e)}
  //         onMouseLeave={handleFootnoteLeave}
  //         onClick={() => {
  //           const el = document.getElementById(`footnote-${noteNumber}`);
  //           if (el)
  //             el.scrollIntoView({ behavior: "smooth", block: "start" });
  //         }}
  //       >
  //         [{noteNumber}]
  //       </sup>
  //     );
  //     lastIndex = regex.lastIndex;
  //   }

  //   elements.push(text.slice(lastIndex));
  //   return elements;
  // };


const parseTextWithFootnotes = (text, footnotes) => {
  if (!text) return null;
  const regex = /\[\^(\d+)\]/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const noteNumber = match[1];

    // Extract portion before this footnote
    const beforeText = text.slice(lastIndex, match.index);
    if (beforeText) {
      // Parse HTML safely
      elements.push(parse(beforeText));
    }

    // Add clickable + hoverable footnote reference
    elements.push(
      <sup
        key={match.index}
        data-footnote={noteNumber}
        className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
        onMouseEnter={(e) => handleFootnoteHover(noteNumber, e)}
        onMouseLeave={handleFootnoteLeave}
        onClick={() => {
          const el = document.getElementById(`footnote-${noteNumber}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        [{noteNumber}]
      </sup>
    );

    lastIndex = regex.lastIndex;
  }

  // Add the final remaining text (after last footnote)
  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    elements.push(parse(remainingText));
  }

  return elements;
};


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading chapter...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );

  if (!chapter)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Chapter not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Chapter Header */}
        <div className="mb-8">
          <div className="text-gray-500 text-sm mb-2">
            Chapter {chapter.serialNumber}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {chapter.title}
          </h1>
          <div className="text-sm text-gray-500">
            Author: {startCase(author)} | Posted:{" "}
            {new Date(chapter.postedDate).toLocaleDateString()} | Last Edited:{" "}
            {new Date(chapter.lastEditedDate).toLocaleDateString()}
          </div>
        </div>

        {/* Main Text */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-800 leading-relaxed text-lg">
            {parseTextWithFootnotes(chapter.mainText, chapter.footnotes)}
          </p>
        </div>

        {/* Footnotes */}
        {chapter.footnotes.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Footnotes
            </h2>
            <div className="space-y-3">
              {chapter.footnotes.map((footnote) => (
                <div
                  key={footnote._id}
                  id={`footnote-${footnote.number}`}
                  className="flex gap-3"
                >
                  <span
                    className="text-blue-600 font-medium cursor-pointer hover:text-blue-800"
                    onClick={() => {
                      const el = document.querySelector(
                        `sup[data-footnote='${footnote.number}']`
                      );
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }}
                  >
                    [{footnote.number}]
                  </span>
                  <span className="text-gray-700">{footnote.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hover Tooltip */}
{hoveredFootnote && currentFootnote && (
  <div
    ref={tooltipRef}
    className="absolute z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl max-w-sm"
    style={{
      left: `${tooltipPos.x}px`,
      top: `${tooltipPos.y}px`,
      maxHeight: '200px',
      overflowY: 'auto'
    }}
    onMouseLeave={() => setHoveredFootnote(null)}
  >
    <div className="text-xs font-semibold mb-1">
      Footnote {currentFootnote.number}
    </div>
    <div className="text-sm">{currentFootnote.text}</div>
  </div>
)}
    </div>
  );
};

export default ChapterPage;
