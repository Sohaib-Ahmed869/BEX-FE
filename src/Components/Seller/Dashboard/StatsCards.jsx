import React, { useState, useEffect } from "react";

const StatsCards = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  // Animated counter hook
  const useCountUp = (end, duration = 2000, delay = 0) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
      if (!mounted) return;

      const timer = setTimeout(() => {
        setHasStarted(true);
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);

          setCount(Math.floor(end * easeOutQuart));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(end);
          }
        };
        animate();
      }, delay);

      return () => clearTimeout(timer);
    }, [end, duration, delay, mounted]);

    return count;
  };

  const avgOrderValue = useCountUp(data.averageOrderValue, 2000, 200);
  const totalRevenue = useCountUp(data.totalRevenue, 2000, 400);
  const totalOrders = useCountUp(data.totalOrders, 2000, 600);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Average Order Value */}
      <div
        className={`
        bg-[#F47458] text-white rounded-lg p-6 
        transform transition-all duration-700 ease-out
        hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/20
        ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        relative overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000
      `}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white  transition-colors duration-300 group-hover:text-white">
            AVG. Order Value
          </h3>
          <div className="p-2 bg-gray-100 rounded transform transition-all duration-300 hover:bg-green-100 hover:rotate-3 hover:scale-110">
            <svg
              className="w-4 h-4 text-gray-600 transition-colors duration-300 hover:text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold mb-1 tabular-nums">
          {formatCurrency(avgOrderValue)}
        </div>
        <p className="text-sm text-white">From last month</p>
      </div>

      {/* Total Orders */}
      <div
        className={`
        bg-white rounded-lg p-6 border border-gray-200
        transform transition-all duration-700 ease-out
        hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300
        ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        relative overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-blue-500/5 before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000
      `}
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-gray-800">
            Total Orders
          </h3>
          <div className="p-2 bg-gray-100 rounded transform transition-all duration-300 hover:bg-blue-100 hover:rotate-3 hover:scale-110">
            <svg
              className="w-4 h-4 text-gray-600 transition-colors duration-300 hover:text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold mb-1 text-gray-900 tabular-nums">
          {formatCurrency(totalRevenue)}
        </div>
        <p className="text-sm text-green-600 font-medium">
          <span className="inline-block transform transition-transform duration-300 hover:scale-110">
            +{totalOrders.toLocaleString()} orders this period
          </span>
        </p>
      </div>

      {/* Total Revenue */}
      <div
        className={`
        bg-white rounded-lg p-6 border border-gray-200
        transform transition-all duration-700 ease-out
        hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-300
        ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        relative overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-green-500/5 before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000
      `}
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-gray-800">
            Total Revenue
          </h3>
          <div className="p-2 bg-gray-100 rounded transform transition-all duration-300 hover:bg-green-100 hover:rotate-3 hover:scale-110">
            <svg
              className="w-4 h-4 text-gray-600 transition-colors duration-300 hover:text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold mb-1 text-gray-900 tabular-nums">
          {formatCurrency(totalRevenue)}
        </div>
        <p className="text-sm text-gray-600 transition-colors duration-300 hover:text-gray-800">
          From {totalOrders.toLocaleString()} orders
        </p>
      </div>
    </div>
  );
};

export default StatsCards;
