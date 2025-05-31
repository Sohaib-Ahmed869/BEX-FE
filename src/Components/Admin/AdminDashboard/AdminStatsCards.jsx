import React, { useState, useEffect } from "react";

const AdminStatsCards = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  // Animated counter hook
  const useCountUp = (end, duration = 2000, delay = 0) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!mounted) return;

      const timer = setTimeout(() => {
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

  // Animated values with staggered delays
  const totalVolume = useCountUp(data.totalVolume, 2000, 100);
  const ordersPerMonth = useCountUp(data.ordersPerMonth, 2000, 200);
  const commissionEarned = useCountUp(data.commissionEarned, 2000, 300);
  const totalRevenue = useCountUp(data.totalRevenue, 2000, 400);
  const totalCompanies = useCountUp(data.totalCompanies, 2000, 500);
  const totalBuyers = useCountUp(data.totalBuyers, 2000, 600);

  const cards = [
    {
      title: "Total revenue",
      value: formatCurrency(totalRevenue),
      growth: data.revenueGrowth,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
            clipRule="evenodd"
          />
        </svg>
      ),
      delay: 400,
      color: "orange",
      bgColor: "bg-[#F47458]",
      featured: true,
    },
    {
      title: "Total Volume",
      value: formatCurrency(totalVolume),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
            clipRule="evenodd"
          />
        </svg>
      ),
      delay: 100,
      color: "blue",
      bgColor: "bg-blue-500",
    },
    {
      title: "Orders per month",
      value: ordersPerMonth.toLocaleString(),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      delay: 200,
      color: "purple",
      bgColor: "bg-purple-500",
    },
    {
      title: "Commission earned",
      value: formatCurrency(commissionEarned),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      delay: 300,
      color: "green",
      bgColor: "bg-green-500",
    },

    {
      title: "Total Companies",
      value: totalCompanies.toLocaleString(),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      delay: 500,
      color: "indigo",
      bgColor: "bg-indigo-500",
    },
    {
      title: "Total Buyers",
      value: totalBuyers.toLocaleString(),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      delay: 600,
      color: "teal",
      bgColor: "bg-teal-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className={`
            ${
              card.featured
                ? card.bgColor + " text-white"
                : "bg-white border border-gray-200"
            }
            rounded-lg p-4 
            transform transition-all duration-700 ease-out
            hover:scale-105 hover:shadow-2xl hover:shadow-${card.color}-500/20
            ${card.featured ? "" : `hover:border-${card.color}-300`}
            ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
            relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
            ${
              card.featured
                ? "before:via-white/10"
                : `before:via-${card.color}-500/5`
            } 
            before:to-transparent
            before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000
          `}
          style={{ animationDelay: `${card.delay}ms` }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`text-xs font-medium ${
                card.featured ? "text-white/90" : "text-gray-600"
              } transition-colors duration-300`}
            >
              {card.title}
            </h3>
            <div
              className={`p-2 ${
                card.featured ? "bg-white/20" : "bg-gray-100"
              } rounded transform transition-all duration-300 hover:scale-110 hover:rotate-3`}
            >
              <div
                className={`${
                  card.featured
                    ? "text-white"
                    : `text-gray-600 hover:text-${card.color}-600`
                } transition-colors duration-300`}
              >
                {card.icon}
              </div>
            </div>
          </div>

          <div
            className={`text-2xl font-bold mb-1 tabular-nums ${
              card.featured ? "text-white" : "text-gray-900"
            }`}
          >
            {card.value}
          </div>

          {card.growth !== undefined && (
            <div className="flex items-center">
              <span
                className={`text-xs font-medium ${
                  card.featured
                    ? "text-white/90"
                    : card.growth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                } transition-transform duration-300 hover:scale-110 inline-block`}
              >
                {card.growth >= 0 ? "+" : ""}
                {card.growth.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;
