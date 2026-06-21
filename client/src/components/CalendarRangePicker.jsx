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
    <div
      style={{
        position: "relative",
        background: "#fff",
        padding: 8,
        borderRadius: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}>
      <button
        onClick={() => {
          setShowCalendar((prev) => !prev);
        }}>
        {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
      </button>

      {showCalendar && (
        <div
          style={{
            position: isMobile ? "fixed" : "absolute",
            top: isMobile ? "30%" : undefined,
            left: isMobile ? "50%" : 0,
            transform: isMobile ? "translate(-50%, -50%)" : undefined,
            zIndex: 50,
            maxWidth: "95vw",
            overflowX: "auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            background: "#fff",
            borderRadius: 8,
          }}>
          <DateRange
            ranges={range}
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
            months={isMobile ? 1 : 2}
            direction={isMobile ? "vertical" : "horizontal"}
            rangeColors={["#3b82f6"]}
          />
          <div
            style={{ display: "flex", justifyContent: "flex-end", padding: 8 }}>
            <button
              onClick={() => {
                localStorage.setItem("startDate", startDate);
                localStorage.setItem("endDate", endDate);
                filteredData();
                refreshData();
                setShowCalendar(false);
              }}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarRangePicker;
