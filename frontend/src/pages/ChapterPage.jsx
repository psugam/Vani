import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import startCase from '@stdlib/string-startcase';
import parse from "html-react-parser";
import DevanagariWordPopup from "../components/DevanagariWordPopup";


const ChapterPage = () => {
  const { chapterNo } = useParams();
  const [chapter, setChapter] = useState(null);
  const [author, setAuthor] = useState("-");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredFootnote, setHoveredFootnote] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedDevanagariWord, setSelectedDevanagariWord] = useState(null);
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
      // console.log(`${import.meta.env.VITE_AUTHOR_URL}/${chapter.userId}`)
      try {
        const authorURL = `${import.meta.env.VITE_AUTHOR_URL}/${chapter.userId}`
        const res = await axios.get(authorURL);
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

  // Check if a word contains Devanagari characters
  const isDevanagari = (str) => {
    const devanagariRegex = /[\u0900-\u097F]/;
    return devanagariRegex.test(str);
  };

  // Tokenize text into words and separators
  const tokenize = (str) => {
    return str.split(/(\s+|[।,;!?.])/);
  };

  // Process text node to make Devanagari words clickable
  const processTextNode = (text) => {
    if (typeof text !== 'string') return text;
    
    const tokens = tokenize(text);
    return tokens.map((token, idx) => {
      const isWord = token.trim() && !/^[।,;!?.\s]+$/.test(token);
      const isDevanagariWord = isWord && isDevanagari(token);
      
      if (isDevanagariWord) {
        return (
          <span
            key={`deva-${idx}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDevanagariWord(token);
            }}
            className="cursor-pointer hover:bg-blue-100 transition-colors rounded px-0.5"
          >
            {token}
          </span>
        );
      }
      return <React.Fragment key={`text-${idx}`}>{token}</React.Fragment>;
    });
  };

  // Recursively process parsed HTML nodes
  const processNodes = (nodes) => {
    if (!nodes) return null;
    
    if (typeof nodes === 'string') {
      return processTextNode(nodes);
    }
    
    if (Array.isArray(nodes)) {
      return nodes.map((node, idx) => {
        if (typeof node === 'string') {
          return <React.Fragment key={idx}>{processTextNode(node)}</React.Fragment>;
        }
        if (React.isValidElement(node)) {
          return React.cloneElement(node, {
            key: idx,
            children: processNodes(node.props.children)
          });
        }
        return node;
      });
    }
    
    if (React.isValidElement(nodes)) {
      return React.cloneElement(nodes, {
        children: processNodes(nodes.props.children)
      });
    }
    
    return nodes;
  };

  const handleFootnoteHover = (footnoteNum, event) => {
    const rect = event.target.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    let top = rect.bottom + scrollY + 4;
    let left = rect.left;
    
    const tooltipHeight = 200;
    const spaceBelow = viewportHeight - rect.bottom;
    
    if (spaceBelow < tooltipHeight && rect.top > tooltipHeight) {
      top = rect.top + scrollY - tooltipHeight - 4;
    }
    
    const tooltipWidth = 384;
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

  const parseTextWithFootnotes = (text, footnotes) => {
    if (!text) return null;
    const regex = /\[\^(\d+)\]/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const noteNumber = match[1];

      const beforeText = text.slice(lastIndex, match.index);
      if (beforeText) {
        const parsed = parse(beforeText);
        const processed = processNodes(parsed);
        elements.push(<React.Fragment key={`before-${match.index}`}>{processed}</React.Fragment>);
      }

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

    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      const parsed = parse(remainingText);
      const processed = processNodes(parsed);
      elements.push(<React.Fragment key="remaining">{processed}</React.Fragment>);
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
          <div className="text-gray-800 leading-relaxed text-lg">
            {parseTextWithFootnotes(chapter.mainText, chapter.footnotes)}
          </div>
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
                            <span
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: footnote.text }}
          />

                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footnote Hover Tooltip */}
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

      {/* Devanagari Word Popup */}
      <DevanagariWordPopup 
        word={selectedDevanagariWord}
        onClose={() => setSelectedDevanagariWord(null)}
      />
    </div>
  );
};

export default ChapterPage;