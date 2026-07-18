import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";

function CalendarRangePicker({ filteredData, refreshData }) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const { startDate, endDate } = range[0];

  useEffect(() => {
    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="calendar-picker">
      <button
        className="calendar-trigger"
        onClick={() => setShowCalendar((prev) => !prev)}>
        <i className="ri-calendar-line"></i>
        <span>
          {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
        </span>
        <i
          className={`ri-arrow-down-s-line calendar-arrow ${showCalendar ? "open" : ""}`}></i>
      </button>

      {showCalendar && (
        <>
          <div
            className="calendar-overlay"
            onClick={() => setShowCalendar(false)}></div>
          <div className={`calendar-dropdown ${isMobile ? "mobile" : ""}`}>
            <DateRange
              ranges={range}
              onChange={(item) => setRange([item.selection])}
              moveRangeOnFirstSelection={false}
              editableDateInputs={true}
              months={isMobile ? 1 : 2}
              direction={isMobile ? "vertical" : "horizontal"}
              rangeColors={["#667eea"]}
            />
            <div className="calendar-footer">
              <button
                className="calendar-cancel"
                onClick={() => setShowCalendar(false)}>
                Cancel
              </button>
              <button
                className="calendar-apply"
                onClick={() => {
                  localStorage.setItem("startDate", startDate);
                  localStorage.setItem("endDate", endDate);
                  filteredData();
                  refreshData();
                  setShowCalendar(false);
                }}>
                <i className="ri-check-line"></i>
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CalendarRangePicker;
