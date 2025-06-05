import React, { useState } from "react";

const SalesSummaryChart = ({ data }) => {
  const [activeTab, setActiveTab] = useState("D");

  if (!data || !data.weeklyData) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Sales summary</h3>
        <div className="text-center text-gray-500 py-8">
          No sales data available
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.weeklyData.map((d) => d.revenue), 1);
  const maxCommission = Math.max(
    ...data.weeklyData.map((d) => d.commission),
    1
  );

  // Calculate revenue growth (simplified)
  const totalRevenue = data.weeklyData.reduce((sum, d) => sum + d.revenue, 0);
  const revenueGrowth = 9.4; // You can calculate this based on actual previous period data

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Sales summary</h3>
      </div>

      <div className="text-sm text-green-600 mb-4 sm:mb-6">
        +{revenueGrowth}% from last period
      </div>

      {/* Chart Container */}
      <div className="space-y-8 md:grid md:grid-cols-1 lg:grid-cols-2 md:gap-8 md:space-y-0">
        {/* Weekly Revenue Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-10">
            Weekly Revenue
          </h4>
          <div className="relative h-48 sm:h-56 md:h-64">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-1 sm:pr-2">
              <span className="text-xs sm:text-sm">
                ${Math.round(maxRevenue).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm">
                ${Math.round(maxRevenue * 0.75).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm">
                ${Math.round(maxRevenue * 0.5).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm">
                ${Math.round(maxRevenue * 0.25).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm">$0</span>
            </div>

            {/* Chart area */}
            <div className="ml-12 sm:ml-14 md:ml-16 h-full flex items-end justify-between space-x-1 sm:space-x-2 border-l border-b border-gray-200">
              {data.weeklyData.map((item, index) => {
                const chartHeight =
                  window.innerWidth < 640
                    ? 160
                    : window.innerWidth < 768
                    ? 180
                    : 220;
                const barHeight =
                  maxRevenue > 0
                    ? (item.revenue / maxRevenue) * chartHeight
                    : 4;

                return (
                  <div
                    key={`${item.day}-${index}`}
                    className="flex flex-col items-center flex-1 group relative"
                  >
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      ${item.revenue.toLocaleString()}
                    </div>

                    {/* Bar */}
                    <div
                      className="bg-orange-500 rounded-t w-6 sm:w-7 md:w-8 min-h-[4px] transition-all duration-300 hover:bg-orange-600"
                      style={{
                        height: `${Math.max(barHeight, 4)}px`,
                      }}
                    ></div>

                    {/* Day label */}
                    <span className="text-xs text-gray-600 mt-1 sm:mt-2">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Weekly Commission Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-10">
            Weekly Commission
          </h4>
          <div className="relative h-48 sm:h-56 md:h-64">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-1 sm:pr-2">
              <span className="text-xs sm:text-sm">
                ${Math.round(maxCommission).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm">
                ${Math.round(maxCommission * 0.75).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm">
                ${Math.round(maxCommission * 0.5).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm">
                ${Math.round(maxCommission * 0.25).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm">$0</span>
            </div>

            {/* Chart area */}
            <div className="ml-12 sm:ml-14 md:ml-16 h-full flex items-end justify-between space-x-1 sm:space-x-2 border-l border-b border-gray-200 relative">
              {data.weeklyData.map((item, index) => {
                const chartHeight =
                  window.innerWidth < 640
                    ? 160
                    : window.innerWidth < 768
                    ? 120
                    : 220;
                const barHeight =
                  maxCommission > 0
                    ? (item.commission / maxCommission) * chartHeight
                    : 4;

                return (
                  <div
                    key={`commission-${item.day}-${index}`}
                    className="flex flex-col items-center flex-1 group relative"
                  >
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      ${item.commission.toLocaleString()}
                    </div>

                    {/* Bar */}
                    <div
                      className="bg-gray-600 rounded-t w-6 sm:w-7 md:w-8 min-h-[4px] transition-all duration-300 hover:bg-gray-700"
                      style={{
                        height: `${Math.max(barHeight, 4)}px`,
                      }}
                    ></div>

                    {/* Day label */}
                    <span className="text-xs text-gray-600 mt-1 sm:mt-2">
                      {item.day}
                    </span>
                  </div>
                );
              })}

              {/* Commission rate line - positioned properly within chart area */}
              {maxCommission > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      points={data.weeklyData
                        .map((item, index) => {
                          const x =
                            (index + 0.5) * (100 / data.weeklyData.length);
                          const y =
                            100 - (item.commission / maxCommission) * 80;
                          return `${x}%,${y}%`;
                        })
                        .join(" ")}
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 sm:space-x-6 mt-6 text-xs flex-wrap gap-y-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-600 rounded mr-2"></div>
          <span>Commission earned</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
          <span>Revenue</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            $
            {data.weeklyData
              .reduce((sum, d) => sum + d.commission, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Commission</div>
        </div>
      </div>
    </div>
  );
};

export default SalesSummaryChart;
