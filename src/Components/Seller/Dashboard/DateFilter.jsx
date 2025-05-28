"use client";

import { useState } from "react";

const DateFilter = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    onDateRangeChange({ startDate: newStartDate, endDate });
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    onDateRangeChange({ startDate, endDate: newEndDate });
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    onDateRangeChange({ startDate: "", endDate: "" });
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={clearFilters}
          className="px-4 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Clear Filters
        </button>

        <div className="text-sm text-gray-600">
          {!startDate && !endDate && "Showing current month data"}
          {(startDate || endDate) && "Custom date range applied"}
        </div>
      </div>
    </div>
  );
};

export default DateFilter;
