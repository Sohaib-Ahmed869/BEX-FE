import React, { useState, useEffect } from "react";
import { Package, Building2, ShoppingCart, Users } from "lucide-react";

const Stats = () => {
  const [animatedValues, setAnimatedValues] = useState({
    products: 0,
    companies: 0,
    orders: 0,
    users: 0,
  });

  const statsData = [
    {
      id: "products",
      icon: Package,
      value: 1000,
      label: "Products Listed",
      color: "from-orange-400 to-red-500",
      iconColor: "text-orange-500",
    },
    {
      id: "companies",
      icon: Building2,
      value: 847,
      label: "Total Companies",
      color: "from-orange-400 to-red-500",
      iconColor: "text-orange-500",
    },
    {
      id: "orders",
      icon: ShoppingCart,
      value: 9000,
      label: "Total Orders",
      color: "from-orange-400 to-red-500",
      iconColor: "text-orange-500",
    },
    {
      id: "users",
      icon: Users,
      value: 3000,
      label: "Total Users Onboard",
      color: "from-orange-400 to-red-500",
      iconColor: "text-orange-500",
    },
  ];

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const animateValue = (start, end, duration, callback) => {
    const startTime = Date.now();
    const range = end - start;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + range * easeOutCubic);

      callback(current);

      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16);
  };

  useEffect(() => {
    // Stagger the animations for each stat
    statsData.forEach((stat, index) => {
      setTimeout(() => {
        animateValue(0, stat.value, 2000, (value) => {
          setAnimatedValues((prev) => ({
            ...prev,
            [stat.id]: value,
          }));
        });
      }, index * 200);
    });
  }, []);

  return (
    <div className="w-full  max-w-[80%] rounded-lg border border-gray-200 mx-auto p-6 bg-orange-50 py-5">
      <div className="flex flex-col w-5xl mx-auto justify-center sm:items-center sm:flex-col  lg:flex-row lg:justify-between gap-6">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;

          return (
            <div
              key={stat.id}
              className={`
                relative overflow-hidden rounded-2xl p-6 
                transform transition-all duration-700 ease-out
               
                cursor-pointer group
                
                animate-fadeIn
                w-full sm:w-64 lg:flex-1 lg:max-w-xs
              `}
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Animated background gradient */}
              <div
                className={`
                absolute inset-0 bg-gradient-to-br ${stat.color} 
                opacity-0  
                transition-opacity duration-500
              `}
              />

              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      absolute w-2 h-2 rounded-full ${
                        stat.color.split(" ")[1]
                      } opacity-20
                      animate-float
                    `}
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${10 + i * 20}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + i}s`,
                    }}
                  />
                ))}
              </div>

              {/* Icon with pulse animation */}
              <div
                className={`
                w-14 h-14 rounded-xl 
                flex items-center justify-center mb-4
                transform transition-all duration-300
                shadow-lg group-hover:shadow-xl
              `}
              >
                <IconComponent
                  className={`
                    w-7 h-7 ${stat.iconColor}
                    transition-all duration-300
                    group-hover:scale-110
                  `}
                />
              </div>

              {/* Animated value with counter effect */}
              <div className="mb-2">
                <span
                  className={`
                  text-3xl font-bold bg-gradient-to-r ${stat.color} 
                  bg-clip-text text-transparent
                  transition-all duration-300
                  group-hover:scale-110
                  inline-block
                `}
                >
                  {formatNumber(animatedValues[stat.id])}
                </span>
              </div>

              {/* Label with subtle animation */}
              <p
                className={`
                text-gray-600 font-medium text-sm
                transition-all duration-300
                group-hover:text-gray-800
              `}
              >
                {stat.label}
              </p>

              {/* Animated border */}
              <div
                className={`
                absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color}
                transform scale-x-0 group-hover:scale-x-100
                transition-transform duration-500 origin-left
              `}
              />

              {/* Shimmer effect */}
              <div
                className="
                absolute inset-0 -top-4 -left-4 bg-gradient-to-r 
                from-transparent via-white to-transparent
                transform -skew-x-12 opacity-0 group-hover:opacity-30
                group-hover:animate-shimmer
              "
              />
            </div>
          );
        })}
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 1.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Stats;
