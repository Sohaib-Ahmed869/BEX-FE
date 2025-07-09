import { useState } from "react";

const DateFilter = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState(""); // Track which filter is active

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    setActiveFilter("custom");
    onDateRangeChange({ startDate: newStartDate, endDate, dateFilter: null });
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    setActiveFilter("custom");
    onDateRangeChange({ startDate, endDate: newEndDate, dateFilter: null });
  };

  const handlePredefinedFilter = (filter) => {
    setActiveFilter(filter);
    setStartDate(""); // Clear custom dates
    setEndDate("");
    onDateRangeChange({ startDate: "", endDate: "", dateFilter: filter });
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setActiveFilter("");
    onDateRangeChange({ startDate: "", endDate: "", dateFilter: null });
  };

  const getFilterDisplayText = () => {
    if (activeFilter === "last30days") return "Last 30 days";
    if (activeFilter === "last90days") return "Last 90 days";
    if (activeFilter === "alltime") return "All time";
    if (activeFilter === "custom") return "Custom date range applied";
    return "Showing current month data";
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Predefined Filter Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            Quick filters:
          </span>
          <button
            onClick={() => handlePredefinedFilter("last30days")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activeFilter === "last30days"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => handlePredefinedFilter("last90days")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activeFilter === "last90days"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Last 90 days
          </button>
          <button
            onClick={() => handlePredefinedFilter("alltime")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activeFilter === "alltime"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All time
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Custom Date Inputs */}
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

        <div className="text-sm text-gray-600">{getFilterDisplayText()}</div>
      </div>
    </div>
  );
};

export default DateFilter;
