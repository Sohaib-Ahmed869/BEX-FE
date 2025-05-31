const TopCompaniesChart = ({ companies }) => {
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

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Top performing company</h3>

      <div className="relative h-64">
        {/* Y-axis labels for revenue */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>700</span>
          <span>600</span>
          <span>500</span>
          <span>400</span>
          <span>200</span>
          <span>0</span>
        </div>

        {/* Y-axis labels for orders (right side) */}
        <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>700</span>
          <span>600</span>
          <span>500</span>
          <span>400</span>
          <span>200</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="mx-8 h-full flex items-end justify-between space-x-4">
          {companies.slice(0, 4).map((company, index) => {
            const revenueHeight = (company.totalRevenue / maxRevenue) * 200;
            const orderHeight = (company.totalOrders / maxOrders) * 200;

            return (
              <div
                key={company.sellerId}
                className="flex flex-col items-center flex-1"
              >
                <div className="w-full flex justify-center items-end space-x-1 mb-2">
                  {/* Revenue bar (dark) */}
                  <div
                    className="bg-gray-600 rounded-t w-6"
                    style={{ height: `${revenueHeight}px`, minHeight: "4px" }}
                  ></div>
                  {/* Orders line chart point */}
                  <div className="relative">
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full absolute"
                      style={{ bottom: `${orderHeight}px` }}
                    ></div>
                  </div>
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
        <div className="absolute mx-8 h-full pointer-events-none">
          <svg className="w-full h-full">
            <polyline
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              points={companies
                .slice(0, 4)
                .map((company, index) => {
                  const x = (index / 3) * 100 + "%";
                  const y = 100 - (company.totalOrders / maxOrders) * 80 + "%";
                  return `${x},${y}`;
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
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
          <span>User activity score</span>
        </div>
      </div>
    </div>
  );
};

export default TopCompaniesChart;
