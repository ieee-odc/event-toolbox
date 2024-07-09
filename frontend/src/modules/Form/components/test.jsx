import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

const DatePicker = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  const handleDateTimeChange = (selectedDates) => {
    setSelectedDateTime(selectedDates[0]);
  };

  return (
    <div
      className="flatpickr-calendar hasTime animate open arrowTop arrowLeft"
      style={{ top: "407.781px", left: "957px", right: "auto" }}
    >
      <Flatpickr
        className="flatpickr-months"
        value={selectedDateTime}
        options={{
          altInput: true,
          enableTime: true,
          dateFormat: "F j, Y H:i",
          altFormat: "F j, Y H:i",
          time_24hr: false,
        }}
        onChange={handleDateTimeChange}
      />
    </div>
  );
};

export default DatePicker;
