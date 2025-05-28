import React, { useState, useEffect } from "react";

const SalesChart = ({ data }) => {
  const [animatedData, setAnimatedData] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Sample data if none provided
  const defaultData = [
    { day: "Sun", revenue: 0 },
    { day: "Mon", revenue: 0 },
    { day: "Tue", revenue: 0 },
    { day: "Wed", revenue: 0 },
    { day: "Thu", revenue: 0 },
    { day: "Fri", revenue: 0 },
    { day: "Sat", revenue: 0 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  useEffect(() => {
    // Initialize with zero heights
    setAnimatedData(chartData.map((item) => ({ ...item, animatedRevenue: 0 })));

    // Animate to actual values
    const timer = setTimeout(() => {
      setAnimatedData(
        chartData.map((item) => ({ ...item, animatedRevenue: item.revenue }))
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [chartData]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Sales Data</h3>
        <div className="text-center text-gray-500 py-8">
          No sales data available
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 2500); // Minimum scale
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const yAxisLabels = [
    maxRevenue,
    Math.round(maxRevenue * 0.75),
    Math.round(maxRevenue * 0.5),
    Math.round(maxRevenue * 0.25),
    0,
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Sales Data</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#F47458] rounded mr-2"></div>
            <span>Revenue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#F47458] rounded mr-2"></div>
            <span>This month</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
            <span>Prev month</span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative h-48">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
            {yAxisLabels.map((label, index) => (
              <span key={index} className="transform -translate-y-1/2">
                {formatCurrency(label)}
              </span>
            ))}
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full flex items-end justify-between">
            {animatedData.map((item, index) => {
              const isActive = item.revenue > 0;
              const height = (item.animatedRevenue / maxRevenue) * 180;
              const isHovered = hoveredBar === index;

              return (
                <div
                  key={item.day}
                  className="flex flex-col items-center flex-1 relative group"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  {isHovered && item.revenue > 0 && (
                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 transform -translate-x-1/2 left-1/2">
                      <div className="text-center">
                        <div className="font-semibold">
                          {formatCurrency(item.revenue)}
                        </div>
                        <div className="text-gray-300">{item.day}</div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                    </div>
                  )}

                  <div className="w-full flex justify-center mb-2 relative">
                    {/* Previous month bar (gray) - always shown as background */}
                    <div
                      className="bg-gray-300 rounded-sm absolute bottom-0"
                      style={{
                        width: "16px",
                        height: `${Math.max(height * 0.8, 4)}px`,
                      }}
                    />

                    {/* Current month bar (red) */}
                    <div
                      className={`rounded-sm relative z-10 transition-all duration-700 ease-out transform ${
                        isActive
                          ? "bg-[#F47458] hover:bg-[#e06449]"
                          : "bg-gray-200"
                      } ${isHovered ? "scale-105" : ""}`}
                      style={{
                        width: "16px",
                        height: `${Math.max(height, 4)}px`,
                        transitionDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>

                  <span className="text-xs text-gray-600 font-medium">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlighted revenue value */}
        <div className="mt-6 text-center relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-6">
            <div className="bg-gray-50 px-3 py-1 rounded text-sm font-semibold text-gray-800">
              {/* {formatCurrency(2300)} */}
            </div>
            <div className="flex justify-center mt-1">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-50"></div>
            </div>
          </div>

          <div className="pt-8">
            <span className="text-2xl font-bold text-gray-800">
              {formatCurrency(
                chartData.reduce((sum, item) => sum + item.revenue, 0)
              )}
            </span>
            <div className="text-sm text-gray-600 mt-1">Total this period</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
