import { useState, useEffect } from "react";

const RecentOrders = ({ orders }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleRows, setVisibleRows] = useState([]);

  // Flatten orders into individual items
  const flattenedItems = [];
  if (orders && orders.length > 0) {
    orders.forEach((order) => {
      order.items.forEach((item) => {
        flattenedItems.push({
          orderId: order.id,
          orderDate: order.orderDate,
          totalAmount: order.totalAmount,
          title: item.title,
          quantity: item.quantity,
          price: parseFloat(item.price),
          orderStatus: item.order_status,
          paymentStatus: item.payment_status,
        });
      });
    });
  }

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Stagger row animations
    if (flattenedItems && flattenedItems.length > 0) {
      flattenedItems.forEach((_, index) => {
        setTimeout(() => {
          setVisibleRows((prev) => [...prev, index]);
        }, index * 100);
      });
    }
  }, [orders]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      "pending approval": "bg-orange-100 text-orange-800",
      approved: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (isPaid) => {
    return isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getPaymentStatusText = (isPaid) => {
    return isPaid ? "Paid" : "Unpaid";
  };

  if (!orders || orders.length === 0 || flattenedItems.length === 0) {
    return (
      <div
        className={`bg-white rounded-lg p-6 border border-gray-200 shadow-sm transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          {/* <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline">
            Go to Orders Page →
          </button> */}
        </div>
        <div className="text-center text-gray-500 py-8 animate-pulse">
          No recent orders
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg p-6 border border-gray-200 shadow-sm transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold animate-fade-in">Recent Orders</h3>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm text-green-600 transition-all duration-300 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            +{flattenedItems.length} item
            {flattenedItems.length !== 1 ? "s" : ""}
          </span>
          {/* <button className="text-sm text-blue-600 hover:text-blue-800 transition-all duration-200 hover:underline hover:scale-105">
            Go to Orders Page →
          </button> */}
        </div>
      </div>

      <div
        className={`overflow-x-auto ${
          flattenedItems.length > 10 ? "max-h-96 overflow-y-auto" : "min-h-96"
        } transition-all duration-300`}
      >
        <div className="min-w-full">
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 bg-white">
                  Order ID
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 bg-white">
                  Item
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 bg-white">
                  Qty
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 bg-white">
                  Order Date
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 bg-white">
                  Item Price
                </th>
                <th className="text-left text-xs px-4 font-medium text-gray-500 uppercase tracking-wider py-3 bg-white">
                  Order Status
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 bg-white">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {flattenedItems.map((item, index) => (
                <tr
                  key={`${item.orderId}-${index}`}
                  className={`hover:bg-gray-50 transition-all duration-200 hover:shadow-sm cursor-pointer ${
                    visibleRows.includes(index)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-4"
                  }`}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <td className="py-3 text-sm text-gray-900 font-mono hover:text-blue-600 transition-colors duration-150">
                    {item.orderId.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="py-3 text-sm text-gray-900">
                    <div className="hover:text-blue-600 transition-colors duration-150">
                      {item.title}
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-900">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs font-semibold hover:bg-blue-100 hover:text-blue-600 transition-all duration-200">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-900 hover:text-blue-600 transition-colors duration-150">
                    {formatDate(item.orderDate)}
                  </td>
                  <td className="py-3 text-sm text-gray-900 font-semibold hover:text-green-600 transition-colors duration-150">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-3 text-sm text-center">
                    <span
                      className={`inline-flex px-2 py-1  items-center text-xs font-semibold capitalize rounded-full transition-all duration-200 hover:scale-105 ${getOrderStatusColor(
                        item.orderStatus
                      )}`}
                    >
                      {item.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-all duration-200 hover:scale-105 ${getPaymentStatusColor(
                        item.paymentStatus
                      )}`}
                    >
                      {getPaymentStatusText(item.paymentStatus)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scroll indicator */}
        {flattenedItems.length > 20 && (
          <div className="flex justify-center py-2 text-xs text-gray-400 animate-bounce">
            Scroll for more orders ↓
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        /* Custom scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default RecentOrders;
