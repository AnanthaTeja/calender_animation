// NoteView.jsx - Component for viewing and editing notes
import React, { useState, useEffect, useRef } from "react";

function NoteView({ date, content, saveNote, goBack }) {
  const [noteContent, setNoteContent] = useState("");
  const textareaRef = useRef(null);

  // Initialize note content when component loads
  useEffect(() => {
    setNoteContent(content);

    // Focus the textarea when the component mounts
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
      }, 400); // Wait for animation to complete
    }
  }, [content, date]);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  // Save note content
  const handleSave = () => {
    saveNote(date, noteContent);
    goBack();
  };

  return (
    <div className="note-view">
      <div className="note-header">
        <button onClick={goBack} className="back-button">
          &lt; Back
        </button>
        <h2>{formatDate(date)}</h2>
        <button onClick={handleSave} className="save-button">
          Save
        </button>
      </div>

      <textarea
        ref={textareaRef}
        className="note-editor"
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Write your notes here..."
      />
    </div>
  );
}

export default NoteView;
