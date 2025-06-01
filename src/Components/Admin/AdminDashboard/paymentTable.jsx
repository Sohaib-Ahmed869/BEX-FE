import React, { useState, useEffect } from "react";

const PaymentsTable = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [rowsVisible, setRowsVisible] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);

    if (data && data.payments) {
      const rowTimers = data.payments.slice(0, 6).map((_, index) =>
        setTimeout(() => {
          setRowsVisible((prev) => [...prev, index]);
        }, 300 + index * 100)
      );

      return () => {
        clearTimeout(timer);
        rowTimers.forEach(clearTimeout);
      };
    }

    return () => clearTimeout(timer);
  }, [data]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      Completed: "bg-green-100 text-green-800 border-green-300",
      Processing: "bg-blue-100 text-blue-800 border-blue-300",
      Cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  if (data.payments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform transition-all duration-700 ease-out animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 animate-fade-in-right">
            Total Payments
          </h3>
        </div>
        <div className="text-center text-gray-500 py-12">
          <div className="text-6xl mb-4 animate-bounce">💳</div>
          <div className="animate-pulse">No payment data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 transform transition-all duration-700 ease-out animate-fade-in-up overflow-hidden hover:shadow-md">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="animate-fade-in-right">
          <h3 className="text-lg font-semibold text-gray-800">
            Total Payments
          </h3>
          <p className="text-sm text-gray-600 opacity-0 animate-fade-in-up animation-delay-200">
            Recent payment transactions
          </p>
        </div>
        <div className="flex items-center space-x-2 animate-fade-in-left">
          <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200 animate-pulse hover:animate-bounce transform transition-transform duration-300 hover:scale-110">
            +{data.payments.length} payments
          </span>
        </div>
      </div>

      {/* Mobile: Show horizontal scroll message */}
      <div className="block md:hidden bg-blue-50 p-2 text-center">
        <p className="text-xs text-blue-600">
          ← Swipe left/right to view all columns →
        </p>
      </div>

      <div className="overflow-hidden">
        <div className="max-h-80 overflow-y-auto overflow-x-auto scroll-smooth">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 sticky top-0 z-10 animate-slide-down">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-3 min-w-[100px] transition-colors duration-300 hover:text-gray-700">
                  Amount
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-3 min-w-[120px] transition-colors duration-300 hover:text-gray-700">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-2 min-w-[200px] transition-colors duration-300 hover:text-gray-700">
                  Description
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-2 min-w-[100px] transition-colors duration-300 hover:text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.payments.slice(0, 6).map((payment, index) => (
                <tr
                  key={payment.id || index}
                  className="hover:bg-gray-50 transition-all duration-300 ease-out transform hover:scale-[1.01] hover:shadow-sm opacity-0 animate-fade-in-up cursor-pointer"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <td className="py-3 px-3 transition-all duration-300 min-w-[100px]">
                    <div className="text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors duration-300 transform hover:scale-105">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td className="py-3 px-3 transition-all duration-300 min-w-[120px]">
                    <div className="text-xs text-gray-900 leading-tight hover:text-blue-600 transition-colors duration-300">
                      {new Date(payment.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      <br />
                      <span className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                        {new Date(payment.date).getFullYear()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 transition-all duration-300 min-w-[200px]">
                    <div
                      className="text-sm text-gray-900 hover:text-blue-600 transition-colors duration-300"
                      title={payment.description}
                    >
                      {payment.description}
                    </div>
                  </td>
                  <td className="py-3 px-2 transition-all duration-300 min-w-[100px]">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border transition-all duration-300 transform hover:scale-105 hover:shadow-sm ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.payments.length > 6 && (
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center animate-fade-in-up animation-delay-500">
            <p className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-300">
              Showing 6 of {data.payments.length} payments. Scroll to see more.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .scroll-smooth {
          scroll-behavior: smooth;
        }

        /* Enhanced scrollbar styling for better mobile UX */
        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-x-auto::-webkit-scrollbar-track,
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 3px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb,
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover,
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Mobile touch scrolling */
        .overflow-x-auto {
          -webkit-overflow-scrolling: touch;
        }

        tbody tr:hover {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.05) 0%,
            rgba(147, 197, 253, 0.05) 100%
          );
        }
      `}</style>
    </div>
  );
};
export default PaymentsTable;
