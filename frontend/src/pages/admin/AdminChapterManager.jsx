import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const AdminChapterManager = () => {
  const [chapters, setChapters] = useState([]);
  const [authorType, setAuthorType] = useState("lanman");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChapter, setEditingChapter] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const ADMIN_NAME = import.meta.env.VITE_ADMIN_NAME;
  const USER_ID = import.meta.env.VITE_USER_ID;

  const fetchChapters = useCallback(async () => {
    setLoading(true);
    const url =
      authorType === "lanman"
        ? import.meta.env.VITE_ALL_CHAPTERS_URL_LANMAN
        : import.meta.env.VITE_ALL_CHAPTERS_URL_MACDONNELL;
    try {
      const res = await axios.get(url);
      setChapters(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setChapters([]);
      setError("Failed to fetch chapters.");
    } finally {
      setLoading(false);
    }
  }, [authorType]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  const handleDeleteChapter = async (chapterId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this chapter? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const url = `${API_BASE}/chapters/${authorType}/deleteonechapter/${chapterId}`;

      // CHANGE: Use 'data' instead of 'params' to send a JSON body
      await axios.delete(url, {
        data: { adminName: ADMIN_NAME },
      });

      // Refresh the list after successful deletion
      fetchChapters();
      alert("Chapter deleted successfully.");
    } catch (err) {
      console.error("Delete error details:", err.response?.data);
      alert(
        `Error: ${err.response?.data?.message || "Could not delete chapter."}`
      );
    }
  };
  const filteredChapters = chapters.filter(
    (c) =>
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Content Dashboard
          </h1>
          <p className="text-slate-500">
            Managing {authorType.toUpperCase()} database
          </p>
        </div>
        <div className="flex gap-4">
          <select
            className="p-2 border rounded-lg bg-white font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={authorType}
            onChange={(e) => setAuthorType(e.target.value)}
          >
            <option value="lanman">Lanman</option>
            <option value="macdonnell">Macdonnell</option>
          </select>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingChapter(null);
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            + New Chapter
          </button>
        </div>
      </div>

      {!isAdding && !editingChapter ? (
        <>
          <input
            type="text"
            placeholder="Search by title or Roman numeral..."
            className="w-full p-4 mb-8 border rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredChapters.map((chapter) => (
              <div
                key={chapter._id}
                className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition"
              >
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                  CH {chapter.serialNumber}
                </span>
                <h3 className="text-xl font-bold my-3 text-slate-800">
                  {chapter.title}
                </h3>
                <div className="flex gap-4 border-t pt-4">
                  <button
                    onClick={() => setEditingChapter(chapter)}
                    className="text-indigo-600 font-bold hover:text-indigo-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteChapter(chapter._id)}
                    className="text-red-500 font-bold hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <ChapterForm
          initialData={editingChapter}
          authorType={authorType}
          adminName={ADMIN_NAME}
          userId={USER_ID}
          apiBase={API_BASE}
          onCancel={() => {
            setIsAdding(false);
            setEditingChapter(null);
          }}
          onSaved={() => {
            setIsAdding(false);
            setEditingChapter(null);
            fetchChapters();
          }}
        />
      )}
    </div>
  );
};

/**
 * FORM COMPONENT WITH INTELLIGENT FOOTNOTE HANDLING
 */
const ChapterForm = ({
  initialData,
  authorType,
  adminName,
  userId,
  apiBase,
  onCancel,
  onSaved,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      serialNumber: "",
      mainText: "",
      footnotes: [],
    }
  );

  const textAreaRef = useRef(null);

  /**
   * CORE LOGIC: Inserts a footnote at the cursor position,
   * renumbers the entire text sequentially, and updates the footnote array.
   */
  const handleAddFootnoteAtCursor = () => {
    const textarea = textAreaRef.current;
    const cursorOffset = textarea.selectionStart;
    const currentText = formData.mainText;

    // 1. Find all existing footnote markers in order of appearance
    const markerRegex = /\[\^(\d+)\]/g;
    const existingMatches = [...currentText.matchAll(markerRegex)];

    // 2. Determine where to insert the new footnote based on cursor position
    let insertPositionInSequence = 0;
    for (let i = 0; i < existingMatches.length; i++) {
      if (existingMatches[i].index < cursorOffset) {
        insertPositionInSequence = i + 1;
      } else {
        break;
      }
    }

    // 3. Calculate the new footnote number (1 higher than the one before cursor, or 1 if none before)
    const newFootnoteNumber = insertPositionInSequence + 1;

    // 4. First, increment all existing markers that are >= newFootnoteNumber
    // We do this BEFORE inserting the new marker to avoid conflicts
    let updatedText = currentText;

    // Find all markers and increment those >= newFootnoteNumber
    const markersToIncrement = [...currentText.matchAll(markerRegex)]
      .filter((match) => parseInt(match[1]) >= newFootnoteNumber)
      .sort((a, b) => parseInt(b[1]) - parseInt(a[1])); // Sort descending to avoid conflicts

    // Replace from highest to lowest to avoid conflicts
    markersToIncrement.forEach((match) => {
      const oldNum = parseInt(match[1]);
      const newNum = oldNum + 1;
      updatedText = updatedText.replace(`[^${oldNum}]`, `[^TEMP${oldNum}]`);
    });

    // Replace TEMP markers with final incremented numbers
    markersToIncrement.forEach((match) => {
      const oldNum = parseInt(match[1]);
      const newNum = oldNum + 1;
      updatedText = updatedText.replace(`[^TEMP${oldNum}]`, `[^${newNum}]`);
    });

    // 5. Now insert the new marker at cursor position
    const newMarker = `[^${newFootnoteNumber}]`;
    const textBeforeCursor = updatedText.substring(0, cursorOffset);
    const textAfterCursor = updatedText.substring(cursorOffset);
    const finalText = textBeforeCursor + newMarker + textAfterCursor;

    // 6. Update the footnotes array - insert new empty footnote at correct position
    const updatedFootnotes = [...formData.footnotes];
    updatedFootnotes.splice(insertPositionInSequence, 0, {
      number: newFootnoteNumber.toString(),
      text: "",
    });

    // 7. Renumber all footnote objects to match their new positions
    updatedFootnotes.forEach((fn, idx) => {
      fn.number = (idx + 1).toString();
    });

    setFormData({
      ...formData,
      mainText: finalText,
      footnotes: updatedFootnotes,
    });

    // Set cursor position after the inserted marker
    setTimeout(() => {
      const newCursorPos = cursorOffset + newMarker.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  /**
   * Deletes a footnote from the list, removes the tag from the text,
   * and re-sequences the remaining ones.
   */
  const removeFootnote = (indexToRemove) => {
    const targetMarker = `[^${indexToRemove + 1}]`;
    let newText = formData.mainText.replace(targetMarker, "");

    const newFootnotes = formData.footnotes.filter(
      (_, i) => i !== indexToRemove
    );

    // Re-sequence the remaining markers in text
    const matches = [...newText.matchAll(/\[\^(\d+)\]/g)];
    matches.forEach((match, i) => {
      const oldMarker = match[0];
      const newMarker = `[^${i + 1}]`;
      newText = newText.replace(oldMarker, `__TEMP_${i + 1}__`);
      newFootnotes[i].number = (i + 1).toString();
    });

    for (let i = 1; i <= newFootnotes.length; i++) {
      newText = newText.replace(`__TEMP_${i}__`, `[^${i}]`);
    }

    setFormData({ ...formData, mainText: newText, footnotes: newFootnotes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = initialData
        ? `${apiBase}/chapters/${authorType}/editonechapter/${initialData._id}`
        : `${apiBase}/chapters/${authorType}/addonechapter`;

      const method = initialData ? "put" : "post";
      const payload = initialData
        ? {
            ...formData,
            adminName,
            chapterId: initialData._id,
            macdonnellChapterId: initialData._id,
          }
        : { ...formData, userId };

      await axios[method](url, payload);
      onSaved();
    } catch (err) {
      alert("Error saving chapter content.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 animate-in fade-in duration-500"
    >
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">
          {initialData ? "Edit" : "New"} {authorType} Chapter
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 font-bold"
        >
          ✕ Close
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-600 mb-2 uppercase">
            Title
          </label>
          <input
            className="w-full p-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="e.g. The Story of Nala"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-2 uppercase">
            Roman Serial
          </label>
          <input
            className="w-full p-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold"
            placeholder="e.g. IX"
            value={formData.serialNumber}
            onChange={(e) =>
              setFormData({ ...formData, serialNumber: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="mb-4 flex justify-between items-end">
        <label className="text-sm font-bold text-slate-600 uppercase">
          Chapter Body Text
        </label>
        <button
          type="button"
          onClick={handleAddFootnoteAtCursor}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-amber-600 shadow-md transition transform active:scale-95"
        >
          📌 Insert Footnote at Cursor
        </button>
      </div>

      <textarea
        ref={textAreaRef}
        className="w-full p-6 border rounded-2xl h-96 font-serif text-lg leading-relaxed bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition mb-10 shadow-inner"
        placeholder="Paste Sanskrit or English text here..."
        value={formData.mainText}
        onChange={(e) => setFormData({ ...formData, mainText: e.target.value })}
        required
      />

      {/* FOOTNOTES SECTION */}
      <div className="border-t border-slate-100 pt-8 bg-slate-50 -mx-8 px-8 rounded-b-2xl">
        <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
          Manage Footnote Content
        </h3>

        <div className="space-y-4 pb-8">
          {formData.footnotes.length === 0 && (
            <p className="text-slate-400 italic text-center py-4">
              No footnotes added yet. Use the button above to insert markers
              into the text.
            </p>
          )}
          {formData.footnotes.map((fn, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-slate-200 group animate-in slide-in-from-left-2"
            >
              <span className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-lg font-bold shadow-md flex-shrink-0">
                {fn.number}
              </span>
              <textarea
                className="flex-1 p-3 border border-slate-100 rounded-lg bg-slate-50 focus:bg-white text-sm outline-none focus:ring-1 focus:ring-indigo-400"
                placeholder={`Describe footnote ${fn.number}...`}
                value={fn.text}
                onChange={(e) => {
                  const updated = [...formData.footnotes];
                  updated[idx].text = e.target.value;
                  setFormData({ ...formData, footnotes: updated });
                }}
              />
              <button
                type="button"
                onClick={() => removeFootnote(idx)}
                className="text-slate-300 hover:text-red-500 p-2 transition"
                title="Delete this footnote and its marker"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition active:scale-95"
        >
          {initialData ? "Update Database Entry" : "Publish to Database"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-10 bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminChapterManager;
