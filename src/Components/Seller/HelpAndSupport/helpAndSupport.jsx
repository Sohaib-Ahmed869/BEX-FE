import React, { useState } from "react";
import { RiHome7Fill } from "react-icons/ri";
import { BiPieChartAlt, BiMoneyWithdraw } from "react-icons/bi";
import { MdOutlineInventory2 } from "react-icons/md";
import { ShoppingCart, MessageSquare, X } from "lucide-react";
import { Link } from "react-router-dom";

const tabDetails = [
  {
    key: "dashboard",
    icon: <RiHome7Fill size={32} className="text-[#f47458] drop-shadow-md" />, // Dashboard
    title: "Dashboard",
    path: "/seller/dashboard",
    description:
      "Get a real-time overview of your business: sales, orders, inventory, and top products.",
    details: [
      {
        heading: "Stats Cards",
        text: "See your average order value, total revenue, and total orders at a glance.",
      },
      {
        heading: "Sales Chart",
        text: "Visualize your weekly sales and compare with previous periods to spot trends.",
      },
      {
        heading: "Date Filter",
        text: "Filter dashboard data by quick presets or custom date ranges to analyze performance.",
      },
      {
        heading: "Recent Orders",
        text: "Quickly view your most recent orders, their status, and essential details.",
      },
      {
        heading: "Top Selling Products",
        text: "See which products are selling best and how much stock remains.",
      },
      {
        heading: "Inventory Details",
        text: "Drill down into inventory stats for each product to monitor stock and sales.",
      },
    ],
  },
  {
    key: "inventory",
    icon: <BiPieChartAlt size={32} className="text-[#f47458] drop-shadow-md" />, // Inventory
    title: "Inventory",
    path: "/seller/product-list",
    description:
      "View a summary of your total products and inventory levels.",
    details: [
      {
        heading: "Inventory Management",
        text: "See the total number of products you have in inventory.",
      },
      {
        heading: "Inventory Actions",
        text: "Get a quick snapshot of your inventory . View/Edit/Delete products",
      },
      {
        heading: "Inventory Details",
        text :" View the inventory details of the product in a table which includes the Inventory name, Inventory code , price, listing status, manufacturer, and stock status."
      }

    ],
  },
  {
    key: "product-list",
    icon: <MdOutlineInventory2 size={32} className="text-[#f47458] drop-shadow-md" />, // Product List
    title: "Product List",
    path: "/seller/listing",
    description:
      "Manage your product listings: add, edit, delete, and view inventory for each listing.",
    details: [
      {
        heading: "View Listings",
        text: "See all your product listings in a sortable, paginated table.",
      },
      {
        heading: "New Listing",
        text: "Create new listings by clicking the 'New Listing' button.",
      },
      {
        heading: "View Inventory",
        text: "For each listing, view its inventory details and stock status. ",
      },
      {
        heading: "Add Inventory",
        text: "Add inventory to a listing directly from the product list.",
      },
      {
        heading: "Delete and Update Inventory",
        text: "Delete and Update Inventory by clicking the 'Delete' and 'Update' button.",
      },
      {
        heading: "Edit Listing Name",
        text: "Edit listing Name by clicking the 'Edit' button.",
      },
      {
        heading: "Status",
        text: "See stock, manufacturer, and listing status for each product.",
      },
    ],
  },
  {
    key: "orders",
    icon: <ShoppingCart size={32} className="text-[#f47458] drop-shadow-md" />, // Orders
    title: "Orders",
    path: "/seller/orders",
    description:
      "Track and manage all your orders, update statuses, and communicate with buyers.",
    details: [
      {
        heading: "Order Table",
        text: "View all orders with details like order ID, product, buyer, quantity, price, payment, status, and date.",
      },
      {
        heading: "Order Actions",
        text: "View order details, confirm or reject orders, chat with buyers about the order",
      },
      {
        heading: "Order Filters",
        text: "Filter orders by status, payment, and date to find what you need quickly.",
      },
      {
        heading: "Order Details",
        text: "See buyer info, items, delivery, and payment status for each order.",
      },
      {
        heading: "Messaging",
        text: "Contact buyers about orders directly from the order details page.",
      },
    ],
  },
  {
    key: "messages",
    icon: <MessageSquare size={32} className="text-[#f47458] drop-shadow-md" />, // Messages
    title: "Messages",
    path: "/seller/chats",
    description:
      "Chat with buyers, manage conversations, and get notified of new messages.",
    details: [
      {
        heading: "Chat List",
        text: "See all your conversations with buyers, including unread message counts.",
      },
      {
        heading: "Search & Filter",
        text: "Search conversations and filter by unread, read, or all messages.",
      },
      {
        heading: "Chat Window",
        text: "Send and receive messages in real time.",
      },

      {
        heading: "Notifications",
        text: "Get notified of unread messages and highlights in your chat list.",
      },
    ],
  },
  {
    key: "stripe-onboarding",
    icon: <BiMoneyWithdraw size={32} className="text-[#f47458] drop-shadow-md" />, // Stripe Onboarding
    title: "Stripe Onboarding",
    path: "/seller/onboarding",
    description:
      "Set up and track your Stripe account to receive payments for your sales.",
    details: [
      {
        heading: "Account Setup",
        text: "Create a Stripe Express account to start receiving payments.",
      },
      {
        heading: "Onboarding Steps",
        text: "Complete identity and bank verification through Stripe's secure process.",
      },
      {
        heading: "Status Tracking",
        text: "See your onboarding status (pending/complete) and get guidance for next steps.",
      },
      {
        heading: "Dashboard Access",
        text: "Open your Stripe dashboard to manage payouts and account details once onboarding is complete.",
      },
      {
        heading: "Error Handling",
        text: "View error or success messages for each onboarding step and get help if needed.",
      },
    ],
  },
];

const HelpAndSupport = () => {
  const [selectedTab, setSelectedTab] = useState(null);

  const handleCardClick = (tab) => {
    setSelectedTab(tab);
  };

  const closePopup = () => {
    setSelectedTab(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-10 px-2 animate-fadeIn relative">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-pop { animation: pop 0.4s cubic-bezier(.4,0,.2,1) both; }
        @keyframes pop {
          0% { transform: scale(0.95); opacity: 0.7; }
          80% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .slide-in {
          animation: slideInRight 0.4s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .slide-out {
          animation: slideOutRight 0.3s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-medium text-[#f47458] mb-2 tracking-tight animate-pop">Seller Help & Support</h1>
        <p className="text-gray-700 mb-10 text-lg animate-fadeIn">
          Welcome to the Seller Help Center! Here you can find guidance on how to use each section of your seller dashboard. Click on any tab name to see a detailed guide.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tabDetails.map((tab, idx) => (
            <div
              key={tab.key}
              className="flex items-start gap-5 bg-white rounded-2xl p-6 border border-[#f47458]/10 shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer relative overflow-hidden animate-fadeIn"
              style={{ animationDelay: `${0.1 + idx * 0.07}s` }}
              onClick={() => handleCardClick(tab)}
            >
              <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                {tab.icon}
              </div>
              <div>
                <span className="text-2xl font-bold text-[#f47458] group-hover:underline group-hover:text-[#d95c3b] transition-colors duration-200">
                  {tab.title}
                </span>
                <p className="text-gray-600 mt-2 text-base leading-relaxed group-hover:text-gray-800 transition-colors duration-200">
                  {tab.description}
                </p>
              </div>
              <span className="absolute right-6 top-6 w-3 h-3 rounded-full bg-[#f47458] opacity-0 group-hover:opacity-80 transition-opacity duration-300 animate-pop"></span>
            </div>
          ))}
        </div>
        <div className="mt-14 animate-fadeIn" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Need More Help?</h2>
          <p className="text-gray-700 mb-2 text-base">
            If you have questions or need further assistance, please contact our support team at{' '}
            <a href="mailto:support@example.com" className="text-[#f47458] underline font-semibold hover:text-[#d95c3b] transition-colors">support@example.com</a>.
          </p>
          <p className="text-gray-700 text-base">
            For urgent issues, call us at <span className="font-semibold text-[#f47458]">(555) 123-4567</span> (Mon-Fri, 9am-5pm EST).
          </p>
        </div>
      </div>
      {/* Side Popup for Tab Details */}
      {selectedTab && (
        <div className="fixed inset-0 z-50 flex justify-end items-stretch">
          {/* Overlay */}
          <div
            className="absolute inset-0 backdrop-blur-sm  transition-opacity duration-300"
            onClick={closePopup}
          />
          {/* Popup */}
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl slide-in flex flex-col animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-[#f47458] p-2 rounded-full transition-colors z-10"
              onClick={closePopup}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <div className="p-8 pt-14 overflow-y-auto h-full">
              <div className="flex items-center gap-4 mb-6">
                <span>{selectedTab.icon}</span>
                <span className="text-2xl font-bold text-[#f47458]">{selectedTab.title}</span>
              </div>
              <p className="text-gray-700 mb-6 text-base">{selectedTab.description}</p>
              <div className="space-y-6">
                {selectedTab.details.map((section, i) => (
                  <div key={i} className="border-l-4 border-[#f47458] pl-4 py-2 bg-[#fff6f3] rounded-md animate-pop" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                    <h3 className="text-lg font-semibold text-[#f47458] mb-1">{section.heading}</h3>
                    <p className="text-gray-700 text-base">{section.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to={selectedTab.path}
                  className="inline-block px-6 py-3 bg-[#f47458] text-white font-semibold rounded-lg shadow hover:bg-[#d95c3b] transition-colors mt-4 text-lg"
                  onClick={closePopup}
                >
                  Go to {selectedTab.title}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpAndSupport;
