"use client";

import { useState } from "react";

const AdminDateFilter = ({ onDateRangeChange }) => {
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

  const setPresetRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    setStartDate(startStr);
    setEndDate(endStr);
    onDateRangeChange({ startDate: startStr, endDate: endStr });
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

        <div className="flex space-x-2">
          <button
            onClick={() => setPresetRange(7)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Last 7 days
          </button>
          <button
            onClick={() => setPresetRange(30)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Last 30 days
          </button>
          <button
            onClick={() => setPresetRange(90)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Last 90 days
          </button>
          <button
            onClick={() => setPresetRange(365)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            This year
          </button>
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

export default AdminDateFilter;
