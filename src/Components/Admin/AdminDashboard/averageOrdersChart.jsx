import { useState, useEffect } from "react";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const DynamicAnalyticsChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState("orders");
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [isVisible, setIsVisible] = useState(false);
  const [chartAnimated, setChartAnimated] = useState(false);
  const [circlesVisible, setCirclesVisible] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${URL}/api/orderanalytics/?period=${selectedPeriod}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  useEffect(() => {
    // Reset animations when data changes
    setIsVisible(false);
    setChartAnimated(false);
    setCirclesVisible([]);
    setHoveredPoint(null);

    if (data) {
      // Trigger container animation
      const timer = setTimeout(() => setIsVisible(true), 100);

      // Trigger chart line animation
      const chartTimer = setTimeout(() => setChartAnimated(true), 600);

      // Get current chart data
      const currentData = getCurrentChartData();

      // Stagger circle animations
      if (currentData && currentData.length > 0) {
        const circleTimers = currentData.map((_, index) =>
          setTimeout(() => {
            setCirclesVisible((prev) => [...prev, index]);
          }, 800 + index * 100)
        );

        return () => {
          clearTimeout(timer);
          clearTimeout(chartTimer);
          circleTimers.forEach(clearTimeout);
        };
      }

      return () => {
        clearTimeout(timer);
        clearTimeout(chartTimer);
      };
    }
  }, [data, selectedChart]);

  const getCurrentChartData = () => {
    if (!data || !data.analyticsData) return [];

    switch (selectedChart) {
      case "orders":
        return data.analyticsData.orderData || [];
      case "revenue":
        return data.analyticsData.revenueData || [];
      case "aov":
        return data.analyticsData.avgOrderValueData || [];
      default:
        return [];
    }
  };

  const getChartTitle = () => {
    switch (selectedChart) {
      case "orders":
        return "Orders";
      case "revenue":
        return "Revenue";
      case "aov":
        return "Average Order Value (AOV)";
      default:
        return "Analytics";
    }
  };

  const formatValue = (value) => {
    if (selectedChart === "orders") {
      return Math.round(value).toString();
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
  };

  const formatYAxisValue = (value) => {
    if (selectedChart === "orders") {
      return Math.round(value).toString();
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
  };

  const formatPeriodLabel = (period) => {
    if (selectedPeriod === "monthly") {
      // Extract day from formats like "Jun 1", "Jan 15", etc.
      const parts = period.split(" ");
      if (parts.length >= 2) {
        return parts[1]; // Return just the day number
      }
      return period;
    } else if (selectedPeriod === "annually") {
      // Extract year from formats like "2023", "Jan 2024", etc.
      const parts = period.split(" ");
      if (parts.length >= 2) {
        return parts[1]; // Return the year part
      }
      // If it's already just a year
      if (period.match(/^\d{4}$/)) {
        return period;
      }
      return period;
    }
    return period; // For weekly, return as is
  };

  const getChartColor = () => {
    switch (selectedChart) {
      case "orders":
        return "#3b82f6"; // Blue
      case "revenue":
        return "#10b981"; // Green
      case "aov":
        return "#f97316"; // Orange
      default:
        return "#f97316";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
        <div className="h-48 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 border border-red-200 shadow-sm">
        <div className="text-center text-red-500 py-8">
          <p className="text-lg font-semibold mb-2">Error loading data</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const chartData = getCurrentChartData();
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Analytics Chart
          </h3>
          <div className="flex gap-2">
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="orders">Orders</option>
              <option value="revenue">Revenue</option>
              <option value="aov">AOV</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
        </div>
        <div className="text-center text-gray-500 py-8">
          No data available for the selected period
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...chartData.map((d) => d.value));
  const minValue = Math.min(...chartData.map((d) => d.value));
  const range = maxValue - minValue;

  // Better padding logic to ensure dots don't get hidden
  let padding = range * 0.15; // Increased padding
  if (range === 0) padding = maxValue * 0.2 || 10; // Handle case where all values are same

  const chartMax = maxValue + padding;
  const chartMin = Math.max(0, minValue - padding);

  // Ensure minimum chart height for visibility
  const finalChartMax = chartMax > chartMin + 20 ? chartMax : chartMin + 20;

  // Generate Y-axis labels with proper integer values for orders
  const generateYAxisLabels = () => {
    const labels = [];
    for (let i = 0; i <= 4; i++) {
      const value = finalChartMax * (1 - i / 4) + chartMin * (i / 4);
      labels.push(selectedChart === "orders" ? Math.round(value) : value);
    }
    return labels;
  };

  const yAxisLabels = generateYAxisLabels();

  return (
    <div
      className={`bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-lg transform transition-all duration-700 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-4 opacity-0 scale-95"
      }`}
    >
      {/* Header with Controls */}
      <div
        className={`flex items-center justify-between mb-6 transform transition-all duration-500 ease-out delay-200 ${
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
        }`}
      >
        <h3 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
          {getChartTitle()}
        </h3>
        <div className="flex gap-3">
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            <option value="orders">Orders</option>
            <option value="revenue">Revenue</option>
            <option value="aov">AOV</option>
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div
        className={`relative h-80 transform transition-all duration-700 ease-out delay-400 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Y-axis labels */}
        <div
          className={`absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-600 font-medium transform transition-all duration-500 ease-out delay-500 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
          }`}
        >
          {yAxisLabels.map((label, index) => (
            <span
              key={index}
              className="transition-colors duration-200 hover:text-gray-800 bg-white px-1"
            >
              {formatYAxisValue(label)}
            </span>
          ))}
        </div>

        <div className="ml-20 h-full relative">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Background grid */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 60"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  opacity="0.8"
                />
              </pattern>
            </defs>
            <rect
              width="400"
              height="300"
              fill="url(#grid)"
              className={`transition-opacity duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Gradient background */}
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={getChartColor()}
                  stopOpacity="0.15"
                />
                <stop
                  offset="100%"
                  stopColor={getChartColor()}
                  stopOpacity="0.02"
                />
              </linearGradient>
            </defs>

            {/* Area under the curve */}
            <path
              d={`M 0,300 ${chartData
                .map((item, index) => {
                  const x =
                    chartData.length === 1
                      ? 190
                      : (index / (chartData.length - 1)) * 380;
                  const y =
                    300 -
                    ((item.value - chartMin) / (finalChartMax - chartMin)) *
                      280;
                  return `L ${x},${y}`;
                })
                .join(" ")} L 380,300 Z`}
              fill="url(#chartGradient)"
              className={`transition-all duration-1000 ease-out delay-700 ${
                chartAnimated ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Main line */}
            <polyline
              fill="none"
              stroke={getChartColor()}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={chartData
                .map((item, index) => {
                  const x =
                    chartData.length === 1
                      ? 190
                      : (index / (chartData.length - 1)) * 380;
                  const y =
                    300 -
                    ((item.value - chartMin) / (finalChartMax - chartMin)) *
                      280;
                  return `${x},${y}`;
                })
                .join(" ")}
              className={`transition-all duration-1000 ease-out ${
                chartAnimated ? "opacity-100" : "opacity-0"
              }`}
              style={{
                strokeDasharray: chartAnimated ? "none" : "1200",
                strokeDashoffset: chartAnimated ? "0" : "1200",
                transition: "stroke-dashoffset 1.8s ease-out 0.6s",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
            />

            {/* Data points */}
            {chartData.map((item, index) => {
              const x =
                chartData.length === 1
                  ? 190
                  : (index / (chartData.length - 1)) * 380;
              const y =
                300 -
                ((item.value - chartMin) / (finalChartMax - chartMin)) * 280;
              const isHovered = hoveredPoint === index;

              return (
                <g key={index}>
                  {/* Pulse ring for hovered point */}
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill={getChartColor()}
                      fillOpacity="0.2"
                      className="animate-ping"
                    />
                  )}

                  {/* Subtle pulse ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill={getChartColor()}
                    fillOpacity="0.15"
                    className={`transition-all duration-500 ease-out ${
                      circlesVisible.includes(index)
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  >
                    <animate
                      attributeName="r"
                      values="10;14;10"
                      dur="3s"
                      repeatCount="indefinite"
                      begin={
                        circlesVisible.includes(index) ? "0s" : "indefinite"
                      }
                    />
                    <animate
                      attributeName="fill-opacity"
                      values="0.15;0.05;0.15"
                      dur="3s"
                      repeatCount="indefinite"
                      begin={
                        circlesVisible.includes(index) ? "0s" : "indefinite"
                      }
                    />
                  </circle>

                  {/* Larger invisible hover area */}
                  <circle
                    cx={x}
                    cy={y}
                    r="20"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* Main data point */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? "7" : "5"}
                    fill={getChartColor()}
                    stroke="white"
                    strokeWidth="3"
                    className={`transition-all duration-300 ease-out cursor-pointer ${
                      circlesVisible.includes(index)
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                    style={{
                      filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))",
                    }}
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Enhanced floating tooltip */}
          {hoveredPoint !== null && (
            <div
              className="absolute pointer-events-none z-10 transform -translate-x-1/2 transition-all duration-200 ease-out"
              style={{
                left: `${
                  chartData.length === 1
                    ? 50
                    : (hoveredPoint / (chartData.length - 1)) * 100
                }%`,
                top: `${
                  100 -
                  ((chartData[hoveredPoint].value - chartMin) /
                    (finalChartMax - chartMin)) *
                    100
                }%`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl border border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-sm font-semibold">
                  {formatValue(chartData[hoveredPoint].value)}
                </div>
                <div className="text-xs text-gray-300 mt-1">
                  {chartData[hoveredPoint].period}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div
        className={`relative mt-6 ml-20 transform transition-all duration-700 ease-out delay-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="relative w-full">
          {chartData.map((item, index) => {
            const leftPosition =
              chartData.length === 1
                ? 50
                : (index / (chartData.length - 1)) * 100;
            const shouldShow =
              chartData.length <= 12 ||
              index % Math.ceil(chartData.length / 10) === 0;

            return (
              <span
                key={index}
                className={`absolute text-xs text-gray-600 font-medium transition-all duration-300 hover:text-gray-800 hover:font-semibold transform hover:scale-110 -translate-x-1/2 ${
                  shouldShow ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  left: `${leftPosition}%`,
                  transitionDelay: `${1200 + index * 50}ms`,
                }}
              >
                {formatPeriodLabel(item.period)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DynamicAnalyticsChart;
