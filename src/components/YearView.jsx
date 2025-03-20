// YearView.jsx - Yearly calendar view component
import React, { useRef, useEffect } from "react";

function YearView({
  currentDate,
  setCurrentDate,
  setView,
  hoveredMonth,
  setHoveredMonth,
  mousePosition,
  monthNames = [
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
  ],
}) {
  const monthsGridRef = useRef(null);

  // Track mouse position over months with improved hover detection
  useEffect(() => {
    const checkHoveredMonth = () => {
      if (!monthsGridRef.current) return;

      // Find which month preview is under the mouse
      const elements = document.elementsFromPoint(
        mousePosition.x,
        mousePosition.y
      );
      const monthElement = elements.find(
        (el) => el.classList && el.classList.contains("month-preview")
      );

      if (monthElement && monthElement.dataset.month) {
        const monthIndex = parseInt(monthElement.dataset.month);
        if (hoveredMonth !== monthIndex) {
          setHoveredMonth(monthIndex);

          // Add a visual indicator for the hovered month
          document.querySelectorAll(".month-preview").forEach((month) => {
            month.classList.remove("pinch-indicator");
          });
          monthElement.classList.add("pinch-indicator");

          // Also add a clear data attribute for pinch detection
          monthElement.setAttribute("data-hovered", "true");
        }
      } else {
        if (hoveredMonth !== null) {
          setHoveredMonth(null);

          // Remove visual indicators when not hovering over any month
          document.querySelectorAll(".month-preview").forEach((month) => {
            month.classList.remove("pinch-indicator");
            month.removeAttribute("data-hovered");
          });
        }
      }
    };

    checkHoveredMonth();
  }, [mousePosition, hoveredMonth, setHoveredMonth]);

  // Navigate to previous year
  const prevYear = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() - 1);
    setCurrentDate(newDate);
  };

  // Navigate to next year
  const nextYear = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + 1);
    setCurrentDate(newDate);
  };

  // Select a month to view
  const selectMonth = (monthIndex) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
    setView("month");
  };

  // Generate mini calendar for month preview
  const generateMiniCalendar = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const rows = [];
    let cells = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="mini-day empty"></div>);
    }

    // Add cells for days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(
        <div key={`day-${day}`} className="mini-day">
          <span className="mini-day-number">{day}</span>
        </div>
      );

      if ((firstDayOfMonth + day) % 7 === 0 || day === daysInMonth) {
        rows.push(
          <div key={`row-${day}`} className="mini-week">
            {cells}
          </div>
        );
        cells = [];
      }
    }

    return rows;
  };

  // Generate all month previews for the year
  const generateMonthPreviews = () => {
    const year = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return monthNames.map((name, index) => (
      <div
        key={name}
        className={`month-preview ${
          index === currentMonth ? "current-month" : ""
        } ${index === hoveredMonth ? "hovered-month" : ""}`}
        onClick={() => selectMonth(index)}
        data-month={index}
      >
        <h3>{name}</h3>
        <div className="mini-calendar">{generateMiniCalendar(year, index)}</div>
      </div>
    ));
  };

  return (
    <div className="year-view">
      <div className="year-header">
        <button onClick={prevYear} className="nav-button">
          &lt;
        </button>
        <h1>{currentDate.getFullYear()}</h1>
        <button onClick={nextYear} className="nav-button">
          &gt;
        </button>
      </div>

      <div className="months-grid" ref={monthsGridRef}>
        {generateMonthPreviews()}
      </div>
    </div>
  );
}

export default YearView;
