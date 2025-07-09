"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";

const WeeklySalesChart = ({ data }) => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [animatedData, setAnimatedData] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [kpiAnimations, setKpiAnimations] = useState({
    currentRevenue: 0,
    prevRevenue: 0,
    percentageChange: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Default empty data structure
  const defaultData = useMemo(
    () => ({
      currentMonth: {
        name: "Current Month",
        start: new Date().toISOString().split("T")[0],
        end: new Date().toISOString().split("T")[0],
      },
      previousMonth: {
        name: "Previous Month",
        start: new Date().toISOString().split("T")[0],
        end: new Date().toISOString().split("T")[0],
      },
      weeks: [
        {
          week: 1,
          label: "Week 1",
          revenue: 0,
          prevRevenue: 0,
          orderCount: 0,
          prevOrderCount: 0,
          percentageChange: 0,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
          dailyBreakdown: {},
          prevDailyBreakdown: {},
        },
      ],
    }),
    []
  );

  const chartData =
    data && data.weeks && data.weeks.length > 0 ? data : defaultData;
  const availableWeeks = chartData.weeks || [];
  const currentWeekData =
    availableWeeks.find((week) => week.week === selectedWeek) ||
    availableWeeks[0];

  // Days of the week in order
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create daily comparison data for the selected week
  const dailyComparisonData = useMemo(() => {
    if (!currentWeekData || !currentWeekData.dailyBreakdown) return [];

    return daysOfWeek.map((day, index) => {
      const currentDay = currentWeekData.dailyBreakdown[day] || {
        revenue: 0,
        orders: 0,
        date: null,
      };
      const prevDay = currentWeekData.prevDailyBreakdown?.[day] || {
        revenue: 0,
        orders: 0,
        date: null,
      };

      return {
        day: dayAbbreviations[index],
        fullDay: day,
        currentRevenue: currentDay.revenue || 0,
        prevRevenue: prevDay.revenue || 0,
        currentOrders: currentDay.orders || 0,
        prevOrders: prevDay.orders || 0,
        date: currentDay.date,
        prevDate: prevDay.date,
      };
    });
  }, [currentWeekData]);

  // Animate KPIs only on mount or when selected week changes
  useEffect(() => {
    if (!hasAnimated) {
      setKpiAnimations({
        currentRevenue: 0,
        prevRevenue: 0,
        percentageChange: 0,
      });

      const timer = setTimeout(() => {
        setKpiAnimations({
          currentRevenue: currentWeekData?.revenue || 0,
          prevRevenue: currentWeekData?.prevRevenue || 0,
          percentageChange: currentWeekData?.percentageChange || 0,
        });
        setHasAnimated(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      // Update immediately without animation for subsequent changes
      setKpiAnimations({
        currentRevenue: currentWeekData?.revenue || 0,
        prevRevenue: currentWeekData?.prevRevenue || 0,
        percentageChange: currentWeekData?.percentageChange || 0,
      });
    }
  }, [currentWeekData, hasAnimated]);

  useEffect(() => {
    // Initialize with zero heights
    setAnimatedData(
      dailyComparisonData.map((item) => ({
        ...item,
        animatedCurrentRevenue: 0,
        animatedPrevRevenue: 0,
      }))
    );

    // Animate to actual values
    const timer = setTimeout(() => {
      setAnimatedData(
        dailyComparisonData.map((item) => ({
          ...item,
          animatedCurrentRevenue: item.currentRevenue,
          animatedPrevRevenue: item.prevRevenue,
        }))
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [dailyComparisonData]);

  // Set default selected week to the first available week
  useEffect(() => {
    if (
      availableWeeks.length > 0 &&
      !availableWeeks.find((w) => w.week === selectedWeek)
    ) {
      setSelectedWeek(availableWeeks[0].week);
    }
  }, [availableWeeks, selectedWeek]);

  const maxRevenue = Math.max(
    ...dailyComparisonData.flatMap((d) => [d.currentRevenue, d.prevRevenue]),
    1000
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const end = new Date(endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${start} - ${end}`;
  };

  const yAxisLabels = [
    maxRevenue,
    Math.round(maxRevenue * 0.75),
    Math.round(maxRevenue * 0.5),
    Math.round(maxRevenue * 0.25),
    0,
  ];

  const getPercentageChangeColor = (change) => {
    if (change > 0) return "text-emerald-600";
    if (change < 0) return "text-red-500";
    return "text-slate-600";
  };

  const getPercentageChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  // Animated counter component
  const AnimatedCounter = ({
    value,
    format = "currency",
    shouldAnimate = true,
  }) => {
    const [displayValue, setDisplayValue] = useState(shouldAnimate ? 0 : value);

    useEffect(() => {
      if (!shouldAnimate) {
        setDisplayValue(value);
        return;
      }

      const startValue = 0;
      const endValue = value;
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = startValue + (endValue - startValue) * easeOutQuart;

        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [value, shouldAnimate]);

    return (
      <span>
        {format === "currency"
          ? formatCurrency(Math.round(displayValue))
          : `${Math.round(displayValue)}%`}
      </span>
    );
  };

  if (!chartData || !availableWeeks.length) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg border border-slate-200 backdrop-blur-sm mx-2 sm:mx-0">
        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
          Weekly Sales Comparison
        </h3>
        <div className="text-center text-slate-500 py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-[#f47458]/20 to-[#e06449]/20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#f47458]/30 rounded-full animate-pulse"></div>
          </div>
          <p className="text-sm sm:text-base">No weekly sales data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg border border-slate-200 backdrop-blur-sm mx-2 sm:mx-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <h3 className="text-base sm:text-lg font-medium">
          Weekly Sales Comparison
        </h3>

        {/* Week Selector */}
        <div className="relative group">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number.parseInt(e.target.value))}
            className="w-full sm:w-auto appearance-none bg-gradient-to-r from-white to-slate-50 border border-slate-300 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 pr-8 sm:pr-10 text-sm font-semibold text-slate-700 hover:border-[#f47458] focus:outline-none focus:ring-2 focus:ring-[#f47458]/30 focus:border-[#f47458] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {availableWeeks.map((week) => (
              <option key={week.week} value={week.week}>
                Week {week.week} (
                {formatDateRange(week.startDate, week.endDate)})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none group-hover:text-[#f47458] transition-colors" />
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-[#f47458]/5 to-[#e06449]/5 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#f47458]/10 hover:border-[#f47458]/20 transition-all duration-300 group hover:shadow-lg">
          <div className="text-xs sm:text-sm font-medium text-slate-600 mb-2">
            Current Week Revenue
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
            <AnimatedCounter
              value={kpiAnimations.currentRevenue}
              shouldAnimate={!hasAnimated}
            />
          </div>
          <div className="text-xs sm:text-sm text-slate-500 flex items-center">
            <div className="w-2 h-2 bg-[#f47458] rounded-full mr-2 animate-pulse"></div>
            {currentWeekData?.orderCount || 0} orders
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200 hover:border-slate-300 transition-all duration-300 group hover:shadow-lg">
          <div className="text-xs sm:text-sm font-medium text-slate-600 mb-2">
            Previous Month Same Week
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
            <AnimatedCounter
              value={kpiAnimations.prevRevenue}
              shouldAnimate={!hasAnimated}
            />
          </div>
          <div className="text-xs sm:text-sm text-slate-500 flex items-center">
            <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
            {currentWeekData?.prevOrderCount || 0} orders
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200 hover:border-slate-300 transition-all duration-300 group hover:shadow-lg">
          <div className="text-xs sm:text-sm font-medium text-slate-600 mb-2">
            Change
          </div>
          <div
            className={`text-xl sm:text-2xl font-bold flex items-center space-x-2 ${getPercentageChangeColor(
              kpiAnimations.percentageChange
            )}`}
          >
            {getPercentageChangeIcon(kpiAnimations.percentageChange)}
            <span>
              <AnimatedCounter
                value={Math.abs(kpiAnimations.percentageChange)}
                format="percentage"
                shouldAnimate={!hasAnimated}
              />
            </span>
          </div>
          <div className="text-xs sm:text-sm text-slate-500">
            vs previous month
          </div>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-slate-600 mb-6 sm:mb-8">
        <div className="flex items-center group">
          <div className="w-4 h-4 bg-gradient-to-r from-[#f47458] to-[#e06449] rounded-md mr-3 shadow-sm group-hover:shadow-md transition-shadow"></div>
          <span className="font-medium">
            {chartData.currentMonth?.name || "Current Month"}
          </span>
        </div>
        <div className="flex items-center group">
          <div className="w-4 h-4 bg-gradient-to-r from-slate-300 to-slate-400 rounded-md mr-3 shadow-sm group-hover:shadow-md transition-shadow"></div>
          <span className="font-medium">
            {chartData.previousMonth?.name || "Previous Month"}
          </span>
        </div>
      </div>

      {/* Enhanced Daily Chart Container */}
      <div className="relative h-72 sm:h-72 bg-gradient-to-b from-slate-50/50  to-transparent rounded-lg sm:rounded-xl p-2  sm:p-4 overflow-hidden">
        {/* Y-axis labels */}
        <div className="absolute left-1 sm:left-4 top-2 sm:top-4 h-52 sm:h-60 flex flex-col justify-between text-xs font-medium text-slate-500">
          {yAxisLabels.map((label, index) => (
            <span
              key={index}
              className="transform -translate-y-1/2 bg-white px-1 sm:px-2 py-1 rounded shadow-sm text-xs sm:text-sm"
            >
              {window.innerWidth < 640
                ? `$${Math.round(label / 1000)}k`
                : formatCurrency(label)}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-12 sm:ml-20 h-52 sm:h-60 flex items-end justify-between">
          {animatedData.map((item, index) => {
            const currentHeight =
              maxRevenue > 0
                ? (item.animatedCurrentRevenue / maxRevenue) *
                  (window.innerWidth < 640 ? 200 : 230)
                : 6;
            const prevHeight =
              maxRevenue > 0
                ? (item.animatedPrevRevenue / maxRevenue) *
                  (window.innerWidth < 640 ? 200 : 230)
                : 6;
            const isHovered = hoveredBar === index;

            return (
              <div
                key={item.day}
                className="flex flex-col items-center flex-1 relative group cursor-pointer"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Enhanced Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 sm:mb-4 bg-slate-800 text-white text-xs px-2 sm:px-4 py-2 sm:py-3 rounded-lg shadow-xl whitespace-nowrap z-20 transform -translate-x-1/2 left-1/2 animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="text-center space-y-1">
                      <div className="font-bold text-[#f47458] text-xs sm:text-sm">
                        Current: {formatCurrency(item.currentRevenue)}
                      </div>
                      <div className="text-slate-300 text-xs">
                        {item.currentOrders} orders
                      </div>
                      <div className="border-t border-slate-600 pt-1">
                        <div className="font-bold text-slate-300 text-xs sm:text-sm">
                          Previous: {formatCurrency(item.prevRevenue)}
                        </div>
                        <div className="text-slate-300 text-xs">
                          {item.prevOrders} orders
                        </div>
                      </div>
                      <div className="text-slate-300 text-xs font-medium pt-1">
                        {item.fullDay}
                      </div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                  </div>
                )}

                <div className="w-full flex justify-center mb-2 sm:mb-3 relative">
                  {/* Previous month bar - gray gradient */}
                  <div
                    className="bg-gradient-to-t from-slate-300 to-slate-400 rounded-md absolute bottom-0 shadow-sm"
                    style={{
                      width: window.innerWidth < 640 ? "18px" : "24px",
                      height: `${Math.max(prevHeight, 6)}px`,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />

                  {/* Current month bar - enhanced foreground */}
                  <div
                    className={`rounded-md relative z-10 transition-all duration-700 ease-out transform shadow-md ${
                      item.currentRevenue > 0
                        ? "bg-gradient-to-t from-[#f47458] to-[#f47458] hover:from-[#e06449] hover:to-[#d45540]"
                        : "bg-gradient-to-t from-slate-300 to-slate-400"
                    } ${isHovered ? "scale-110 shadow-lg" : ""}`}
                    style={{
                      width: window.innerWidth < 640 ? "18px" : "24px",
                      height: `${Math.max(currentHeight, 6)}px`,
                      transitionDelay: `${index * 100}ms`,
                    }}
                  />
                </div>

                <span
                  className={`text-xs font-semibold transition-colors duration-200 ${
                    isHovered ? "text-[#f47458]" : "text-slate-600"
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Week Summary */}
      <div className="mt-6 sm:mt-8 text-center">
        <div className="text-xs sm:text-sm font-medium text-slate-600 mb-4 bg-slate-50 rounded-lg py-2 px-4 inline-block">
          Week {selectedWeek}:{" "}
          {formatDateRange(
            currentWeekData?.startDate,
            currentWeekData?.endDate
          )}
        </div>

        {/* Enhanced Daily totals */}
        <div className="flex flex-col sm:flex-row justify-center sm:space-x-8 space-y-2 sm:space-y-0 text-sm">
          <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#f47458]/10 to-[#e06449]/10 rounded-lg px-3 sm:px-4 py-2">
            <div className="w-3 h-3 bg-[#f47458] rounded-full shadow-sm"></div>
            <span className="font-medium text-slate-700 text-sm">
              Total:{" "}
              {formatCurrency(
                dailyComparisonData.reduce(
                  (sum, day) => sum + day.currentRevenue,
                  0
                )
              )}
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg px-3 sm:px-4 py-2">
            <div className="w-3 h-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full shadow-sm"></div>
            <span className="font-medium text-slate-700 text-sm">
              Previous:{" "}
              {formatCurrency(
                dailyComparisonData.reduce(
                  (sum, day) => sum + day.prevRevenue,
                  0
                )
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySalesChart;
