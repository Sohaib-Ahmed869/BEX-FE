import { useState, useEffect } from "react";

const AverageOrderChart = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [chartAnimated, setChartAnimated] = useState(false);
  const [circlesVisible, setCirclesVisible] = useState([]);

  useEffect(() => {
    // Trigger container animation
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Trigger chart line animation
    const chartTimer = setTimeout(() => setChartAnimated(true), 600);

    // Stagger circle animations
    if (data && data.revenueData) {
      const circleTimers = data.revenueData.map((_, index) =>
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
  }, [data]);

  if (!data || !data.revenueData) {
    return (
      <div
        className={`bg-white rounded-lg p-6 border border-gray-200 shadow-sm transform transition-all duration-700 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-4 opacity-0 scale-95"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 animate-fade-in-right">
            Average order value (AOV)
          </h3>
          <select className="text-sm border border-gray-300 rounded px-3 py-1 transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
            <option>Yearly</option>
          </select>
        </div>
        <div className="text-center text-gray-500 py-8 animate-pulse">
          No chart data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.revenueData.map((d) => d.value));
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transform transition-all duration-700 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-4 opacity-0 scale-95"
      }`}
    >
      {/* Animated Header */}
      <div
        className={`flex items-center justify-between mb-4 transform transition-all duration-500 ease-out delay-200 ${
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
        }`}
      >
        <h3 className="text-lg font-semibold">Average order value (AOV)</h3>
        <select className="text-sm border border-gray-300 rounded px-3 py-1 transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:shadow-sm">
          <option>Yearly</option>
        </select>
      </div>

      {/* Animated Average Value */}
      <div
        className={`mb-4 transform transition-all duration-600 ease-out delay-300 ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-4 opacity-0 scale-90"
        }`}
      >
        <div className="text-2xl font-bold text-blue-600 mb-2 transition-all duration-300 hover:text-blue-700 hover:scale-105">
          {formatCurrency(
            data.revenueData.reduce((sum, item) => sum + item.value, 0) /
              data.revenueData.length
          )}
        </div>
      </div>

      {/* Animated Chart Container */}
      <div
        className={`relative h-48 transform transition-all duration-700 ease-out delay-400 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Y-axis labels */}
        <div
          className={`absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 transform transition-all duration-500 ease-out delay-500 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
          }`}
        >
          <span className="transition-colors duration-200 hover:text-gray-700">
            {formatCurrency(maxValue)}
          </span>
          <span className="transition-colors duration-200 hover:text-gray-700">
            {formatCurrency(maxValue * 0.75)}
          </span>
          <span className="transition-colors duration-200 hover:text-gray-700">
            {formatCurrency(maxValue * 0.5)}
          </span>
          <span className="transition-colors duration-200 hover:text-gray-700">
            {formatCurrency(maxValue * 0.25)}
          </span>
          <span className="transition-colors duration-200 hover:text-gray-700">
            $0
          </span>
        </div>

        <div className="ml-12 h-full">
          <svg className="w-full h-full" viewBox="0 0 400 180">
            {/* Animated background grid lines */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="36"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 36"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="0.5"
                  opacity="0.7"
                />
              </pattern>
            </defs>
            <rect
              width="400"
              height="180"
              fill="url(#grid)"
              className={`transition-opacity duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Animated gradient background */}
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Animated area under the curve */}
            <path
              d={`M 0,180 ${data.revenueData
                .map((item, index) => {
                  const x = (index / (data.revenueData.length - 1)) * 380;
                  const y = 180 - (item.value / maxValue) * 160;
                  return `L ${x},${y}`;
                })
                .join(" ")} L 380,180 Z`}
              fill="url(#chartGradient)"
              className={`transition-all duration-1000 ease-out delay-700 ${
                chartAnimated ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Animated main line */}
            <polyline
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data.revenueData
                .map((item, index) => {
                  const x = (index / (data.revenueData.length - 1)) * 380;
                  const y = 180 - (item.value / maxValue) * 160;
                  return `${x},${y}`;
                })
                .join(" ")}
              className={`transition-all duration-1000 ease-out ${
                chartAnimated ? "opacity-100" : "opacity-0"
              }`}
              style={{
                strokeDasharray: chartAnimated ? "none" : "1000",
                strokeDashoffset: chartAnimated ? "0" : "1000",
                transition: "stroke-dashoffset 1.5s ease-out 0.6s",
              }}
            />

            {/* Animated data points */}
            {data.revenueData.map((item, index) => {
              const x = (index / (data.revenueData.length - 1)) * 380;
              const y = 180 - (item.value / maxValue) * 160;
              return (
                <g key={index}>
                  {/* Animated pulse ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="#f97316"
                    fillOpacity="0.2"
                    className={`transition-all duration-500 ease-out ${
                      circlesVisible.includes(index)
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  >
                    <animate
                      attributeName="r"
                      values="8;12;8"
                      dur="2s"
                      repeatCount="indefinite"
                      begin={
                        circlesVisible.includes(index) ? "0s" : "indefinite"
                      }
                    />
                    <animate
                      attributeName="fill-opacity"
                      values="0.2;0;0.2"
                      dur="2s"
                      repeatCount="indefinite"
                      begin={
                        circlesVisible.includes(index) ? "0s" : "indefinite"
                      }
                    />
                  </circle>

                  {/* Main data point */}
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#f97316"
                    stroke="white"
                    strokeWidth="2"
                    className={`transition-all duration-500 ease-out cursor-pointer hover:r-6 ${
                      circlesVisible.includes(index)
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                    style={{
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  />

                  {/* Hover tooltip */}
                  <g className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <rect
                      x={x - 25}
                      y={y - 35}
                      width="50"
                      height="20"
                      rx="4"
                      fill="rgba(0,0,0,0.8)"
                    />
                    <text
                      x={x}
                      y={y - 20}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                    >
                      {formatCurrency(item.value)}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Animated Timeline */}
      <div
        className={`flex justify-between text-xs text-gray-500 mt-2 transform transition-all duration-700 ease-out delay-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {[
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ].map((month, index) => (
          <span
            key={month}
            className={`transition-all duration-300 hover:text-gray-700 hover:font-medium transform hover:scale-110 ${
              isVisible ? "opacity-100" : "opacity-50"
            }`}
            style={{ transitionDelay: `${1200 + index * 50}ms` }}
          >
            {month}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AverageOrderChart;
