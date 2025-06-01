import { useState } from "react";

const RecentOrdersTable = ({ orders }) => {
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      "pending approval": "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
      processing: "bg-blue-100 text-blue-800 border-blue-300",
      shipped: "bg-blue-100 text-blue-800 border-blue-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      "Order placed": "bg-blue-100 text-blue-800 border-blue-300",
      Shipping: "bg-blue-100 text-blue-800 border-blue-300",
      "Sent to retipping": "bg-yellow-100 text-yellow-800 border-yellow-300",
      Delivered: "bg-green-100 text-green-800 border-green-300",
      "Technical issue": "bg-red-100 text-red-800 border-red-300",
      Completed: "bg-green-100 text-green-800 border-green-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Flatten orders to show individual items
  const flattenedItems = [];
  orders?.forEach((order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item, index) => {
        flattenedItems.push({
          ...item,
          orderId: order.id,
          orderDate: order.orderDate,
          buyerName: order.buyerName,
          buyerEmail: order.buyerEmail,
          totalAmount: order.totalAmount,
          platformFee: order.platformFee,
          paymentStatus: order.paymentStatus,
          itemIndex: index,
          isFirstItem: index === 0,
          totalItems: order.items.length,
        });
      });
    }
  });

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform transition-all duration-700 ease-out animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 animate-fade-in-right">
            Recent Orders
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 transition-all duration-300 hover:scale-105 hover:bg-blue-50 px-3 py-1 rounded-lg transform animate-fade-in-left">
            Go to Orders Page →
          </button>
        </div>
        <div className="text-center text-gray-500 py-12">
          <div className="text-6xl mb-4 animate-bounce">📦</div>
          <div className="animate-pulse">No recent orders</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 transform transition-all duration-700 ease-out animate-fade-in-up overflow-hidden hover:shadow-md">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="animate-fade-in-right">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
          <p className="text-sm text-gray-600 opacity-0 animate-fade-in-up animation-delay-200">
            Individual items from recent orders
          </p>
        </div>
        <div className="flex items-center space-x-2 animate-fade-in-left">
          <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200 animate-pulse hover:animate-bounce transform transition-transform duration-300 hover:scale-110">
            +{flattenedItems.length} items
          </span>
          <button className="text-sm text-blue-600 hover:text-blue-800 transition-all duration-300 hover:bg-blue-50 px-2 py-1 rounded transform hover:scale-105 hover:-translate-y-0.5">
            Go to Orders Page →
          </button>
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
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 sticky top-0 z-10 animate-slide-down">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-3 min-w-[120px] transition-colors duration-300 hover:text-gray-700">
                  Order ID
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-3 min-w-[180px] transition-colors duration-300 hover:text-gray-700">
                  Item Details
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-2 min-w-[100px] transition-colors duration-300 hover:text-gray-700">
                  Company
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-2 min-w-[150px] transition-colors duration-300 hover:text-gray-700">
                  Buyer
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-2 min-w-[120px] transition-colors duration-300 hover:text-gray-700">
                  Order Date
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-2 min-w-[100px] transition-colors duration-300 hover:text-gray-700">
                  Amount
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-2 min-w-[120px] transition-colors duration-300 hover:text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {flattenedItems.map((item, index) => (
                <tr
                  key={`${item.orderId}-${item.itemIndex}`}
                  className="hover:bg-gray-50 transition-all duration-300 ease-out transform hover:scale-[1.01] hover:shadow-sm opacity-0 animate-fade-in-up cursor-pointer"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <td className="py-3 px-3 transition-all duration-300 min-w-[120px]">
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded block w-fit transition-all duration-300 hover:bg-gray-200 hover:scale-105 transform">
                        {item.orderId.substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 transition-all duration-300 min-w-[180px]">
                    <div className="space-y-1">
                      <div
                        className="text-xs font-medium text-gray-900 hover:text-blue-600 transition-colors duration-300"
                        title={item.title}
                      >
                        {item.title}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded transition-all duration-300 hover:bg-gray-200 transform hover:scale-105">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 transition-all duration-300 min-w-[100px]">
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full font-medium block w-fit transition-all duration-300 hover:bg-purple-100 hover:scale-105 transform hover:shadow-sm">
                      {item.company || "Unknown"}
                    </span>
                  </td>
                  <td className="py-3 px-2 transition-all duration-300 min-w-[150px]">
                    <div className="space-y-1">
                      <div
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-300"
                        title={item.buyerName}
                      >
                        {item.buyerName}
                      </div>
                      <div
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-300"
                        title={item.buyerEmail}
                      >
                        {item.buyerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 transition-all duration-300 min-w-[120px]">
                    <div className="text-xs text-gray-900 leading-tight hover:text-blue-600 transition-colors duration-300">
                      {new Date(item.orderDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      <br />
                      <span className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                        {new Date(item.orderDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 transition-all duration-300 min-w-[100px]">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors duration-300">
                        {formatCurrency(item.price)}
                      </div>
                      <div className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-300">
                        Fee: {formatCurrency(item.platformFee)}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 transition-all duration-300 min-w-[120px]">
                    <div className="space-y-1">
                      <span
                        className={`inline-block text-nowrap capitalize text-center px-2 py-1 text-xs font-medium rounded-full border transition-all duration-300 transform hover:scale-105 hover:shadow-sm ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {flattenedItems.length > 8 && (
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center animate-fade-in-up animation-delay-500">
            <p className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-300">
              Showing {flattenedItems.length} items from {orders.length} orders.
              Scroll to see more.
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
export default RecentOrdersTable;
