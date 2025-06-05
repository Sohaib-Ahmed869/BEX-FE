import React, { useState, useEffect } from "react";

const TopCompaniesChart = ({ companies }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredCompany, setHoveredCompany] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!companies || companies.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Top performing company</h3>
        <div className="text-center text-gray-500 py-8">
          No company data available
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...companies.map((c) => c.totalRevenue));
  const maxOrders = Math.max(...companies.map((c) => c.totalOrders));

  // Generate dynamic Y-axis labels
  const generateYAxisLabels = (maxValue) => {
    const steps = 6;
    const stepValue = Math.ceil(maxValue / (steps - 1));
    return Array.from({ length: steps }, (_, i) => {
      const value = stepValue * (steps - 1 - i);
      return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString();
    });
  };

  const revenueLabels = generateYAxisLabels(maxRevenue);
  const orderLabels = generateYAxisLabels(maxOrders);

  const handleMouseEnter = (company, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const parentRect = event.currentTarget
      .closest(".bg-white")
      .getBoundingClientRect();
    setHoveredPosition({
      x: rect.left + rect.width / 2 - parentRect.left,
      y: rect.top - parentRect.top - 10,
    });
    setHoveredCompany(company);
  };

  const handleMouseLeave = () => {
    setHoveredCompany(null);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 relative">
      <h3 className="text-lg font-semibold mb-4">Top performing company</h3>

      <div className="relative h-64">
        {/* Y-axis labels for revenue */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          {revenueLabels.map((label, index) => (
            <span key={`revenue-${index}`}>{label}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-8 mr-4 h-full flex items-end justify-between space-x-4">
          {companies.slice(0, 4).map((company, index) => {
            const revenueHeight = (company.totalRevenue / maxRevenue) * 200;
            const orderHeight = (company.totalOrders / maxOrders) * 200;
            const animatedRevenueHeight = revenueHeight * animationProgress;

            return (
              <div
                key={company.sellerId}
                className="flex flex-col items-center flex-1"
              >
                <div className="w-full flex justify-center items-end space-x-1 mb-2">
                  {/* Revenue bar (dark) */}
                  <div
                    className="bg-gray-600 rounded-t w-6 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                    style={{
                      height: `${animatedRevenueHeight}px`,
                      minHeight: "4px",
                      transition: "height 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => handleMouseEnter(company, e)}
                    onMouseLeave={handleMouseLeave}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 text-center">
                  {company.companyName.length > 10
                    ? company.companyName.substring(0, 10) + "..."
                    : company.companyName}
                </span>
              </div>
            );
          })}
        </div>

        {/* Orange line connecting the points */}
        <div className="absolute ml-8 mr-4 h-full pointer-events-none">
          <svg className="w-full h-full">
            <polyline
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              strokeDasharray="1000"
              strokeDashoffset={1000 * (1 - animationProgress)}
              style={{
                transition:
                  "stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s",
              }}
              points={companies
                .slice(0, 4)
                .map((company, index) => {
                  const x = (index / 3) * 100;
                  const y = 100 - (company.totalOrders / maxOrders) * 80;
                  return `${x}%,${y}%`;
                })
                .join(" ")}
            />
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-600 rounded mr-2"></div>
          <span>Total Volume</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCompany && (
        <div
          className="absolute z-50 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: hoveredPosition.x,
            top: hoveredPosition.y,
          }}
        >
          <div className="font-semibold">{hoveredCompany.companyName}</div>
          <div className="text-gray-300">
            Revenue: ${(hoveredCompany.totalRevenue / 1000).toFixed(0)}k
          </div>
          <div className="text-gray-300">
            Orders: {hoveredCompany.totalOrders}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};
export default TopCompaniesChart;
