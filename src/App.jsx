// App.jsx - Main application component
import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import MonthView from "./components/MonthView";
import YearView from "./components/YearView";
import NoteView from "./components/NoteView";
import { useGestureDetector } from "./hooks/useGestureDetector";

function App() {
  const [view, setView] = useState("month"); // 'month', 'year', or 'note'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState({});
  const [transition, setTransition] = useState("");
  const appRef = useRef(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Use the gesture detector hook
  const { mousePosition, addGestureListeners, removeGestureListeners } =
    useGestureDetector({
      onPinchIn: handlePinchIn,
      onPinchOut: handlePinchOut,
    });

  // Handle pinch in gesture (zoom out)
  function handlePinchIn() {
    if (view === "month") {
      setTransition("zoom-out");
      setTimeout(() => {
        setView("year");
        setTimeout(() => setTransition(""), 50);
      }, 300);
    } else if (view === "note") {
      setTransition("slide-out");
      setTimeout(() => {
        setView("month");
        setTimeout(() => setTransition(""), 50);
      }, 300);
    }
  }

  // Handle pinch out gesture (zoom in)
  function handlePinchOut() {
    if (view === "year") {
      setTransition("zoom-in");
      setTimeout(() => {
        setView("month");
        setTimeout(() => setTransition(""), 50);
      }, 300);
    } else if (view === "month") {
      // Try to find date element under the cursor
      const element = document.elementFromPoint(
        mousePosition.x,
        mousePosition.y
      );

      // Look for the date attribute on the element or its parents
      let currentElement = element;
      while (
        currentElement &&
        !currentElement.dataset.date &&
        currentElement !== document.body
      ) {
        currentElement = currentElement.parentElement;
      }

      if (currentElement && currentElement.dataset.date) {
        setTransition("slide-in");
        const selectedDate = new Date(currentElement.dataset.date);
        setSelectedDate(selectedDate);
        setTimeout(() => {
          setView("note");
          setTimeout(() => setTransition(""), 50);
        }, 300);
      }
    }
  }

  // Add direct method to open notes for a specific date
  const openNoteForDate = (date) => {
    setTransition("slide-in");
    setSelectedDate(date);
    setTimeout(() => {
      setView("note");
      setTimeout(() => setTransition(""), 50);
    }, 300);
  };

  // Save note for a specific date
  const saveNote = (date, content) => {
    const dateKey = date.toISOString().split("T")[0];
    setNotes((prevNotes) => ({
      ...prevNotes,
      [dateKey]: content,
    }));
  };

  // Get note for a specific date
  const getNote = (date) => {
    if (!date) return "";
    const dateKey = date.toISOString().split("T")[0];
    return notes[dateKey] || "";
  };

  // Set up event listeners when component mounts
  useEffect(() => {
    const element = appRef.current;
    if (element) {
      addGestureListeners(element);
    }

    return () => {
      if (element) {
        removeGestureListeners(element);
      }
    };
  }, [view, addGestureListeners, removeGestureListeners]);

  return (
    <div className="app-container" ref={appRef}>
      <div className={`view-container ${transition}`}>
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            notes={notes}
            openNoteForDate={openNoteForDate}
          />
        )}

        {view === "year" && (
          <YearView
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            setView={setView}
            hoveredMonth={hoveredMonth}
            setHoveredMonth={setHoveredMonth}
            mousePosition={mousePosition}
          />
        )}

        {view === "note" && (
          <NoteView
            date={selectedDate}
            content={getNote(selectedDate)}
            saveNote={saveNote}
            goBack={() => {
              setTransition("slide-out");
              setTimeout(() => {
                setView("month");
                setTimeout(() => setTransition(""), 50);
              }, 300);
            }}
          />
        )}
      </div>

      <div
        className="pointer-indicator"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          opacity: view === "month" || view === "year" ? 1 : 0,
        }}
      ></div>

      <div className="instructions">
        <h3>Navigation Instructions:</h3>
        <p>• Pinch out (spread fingers) on a month to view the full year</p>
        <p>
          • Pinch in (bring fingers together) on the year view to return to
          month view
        </p>
        <p>• Pinch in while hovering over a date to open notes for that date</p>
        <p>• Pinch out on notes to return to month view</p>
        <p>• You can also simply click on any date to open its notes</p>
        <p className="gesture-debug">
          Mouse position: {mousePosition.x}, {mousePosition.y}
        </p>
        {hoveredMonth !== null && <p>Hovering over: {hoveredMonth}</p>}
      </div>
    </div>
  );
}

export default App;
