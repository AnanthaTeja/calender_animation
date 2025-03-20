// MonthView.jsx - Monthly calendar view component
import React from "react";

function MonthView({ currentDate, setCurrentDate, notes, openNoteForDate }) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Navigate to previous month
  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // Navigate to next month
  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Today's date for highlighting
    const today = new Date();
    const isCurrentMonth =
      today.getMonth() === month && today.getFullYear() === year;

    // Add cells for days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split("T")[0];
      const hasNote = notes[dateKey] ? true : false;
      const isToday = isCurrentMonth && today.getDate() === day;

      days.push(
        <div
          key={`day-${day}`}
          className={`calendar-day ${hasNote ? "has-note" : ""} ${
            isToday ? "today" : ""
          }`}
          data-date={date.toISOString()}
          onClick={() => openNoteForDate(date)}
        >
          <span className="day-number">{day}</span>
          {hasNote && <div className="note-indicator"></div>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="month-view">
      <div className="calendar-header">
        <button onClick={prevMonth} className="nav-button">
          &lt;
        </button>
        <h2>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="nav-button">
          &gt;
        </button>
      </div>

      <div className="calendar-days-header">
        {dayNames.map((day) => (
          <div key={day} className="day-name">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-days">{generateCalendarDays()}</div>
    </div>
  );
}

export default MonthView;
