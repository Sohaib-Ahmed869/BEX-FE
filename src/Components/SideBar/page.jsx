import { ShoppingCart, MessageSquare, LogOut } from "lucide-react";
import { MdOutlineInventory2 } from "react-icons/md";
import { BiPieChartAlt } from "react-icons/bi";
import { RiHome7Fill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { BsExclamationCircleFill } from "react-icons/bs";
import logo from "../../assets/logo.png";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Define the menu items with routes instead of components
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <RiHome7Fill size={24} />,
      path: "/dashboard",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: <BiPieChartAlt size={24} />,
      path: "/inventory",
    },
    {
      id: "product-list",
      label: "Product List",
      icon: <MdOutlineInventory2 size={24} />,
      path: "/product-list",
      childPaths: [
        "/product-list/new",
        "/product-list/edit/",
        "/product-list/view/",
      ],
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart size={24} />,
      path: "/orders",
    },
  ];

  const generalItems = [
    {
      id: "messages",
      label: "Messages",
      icon: <MessageSquare size={24} />,
      path: "/messages",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <IoSettingsSharp size={24} />,
      path: "/settings",
    },
    {
      id: "support",
      label: "Support",
      icon: <BsExclamationCircleFill size={23} />,
      path: "/support",
    },
  ];

  // Helper function to check if a path is active
  const isActive = (path) => {
    // Check if the current path matches exactly
    if (location.pathname === path) {
      return true;
    }

    // Find the menu item that matches this path
    const menuItem = menuItems.find((item) => item.path === path);

    // If the menu item has childPaths, check if the current location matches any of them
    if (menuItem && menuItem.childPaths) {
      return menuItem.childPaths.some((childPath) => {
        // For exact path matches
        if (location.pathname === childPath) {
          return true;
        }

        // For paths that are base paths followed by IDs (like "/product-list/edit/123")
        // Check if the current path starts with the child path
        if (
          childPath.endsWith("/") &&
          location.pathname.startsWith(childPath)
        ) {
          return true;
        }

        return false;
      });
    }

    // Check if it's a general item
    return false;
  };
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />{" "}
      {/* Sidebar - fixed height with shadow */}
      <div className="w-1/5 bg-white shadow-md pl-8 pt-8 pr-[45px] flex flex-col h-full">
        {/* Logo */}
        <div className="p-4">
          <img src={logo} alt="Logo" width={100} height={100} />
        </div>

        {/* Main Menu */}
        <div className="p-4">
          <div className="text-sm font-medium text-gray-500 mb-4">
            Main Menu
          </div>
          <nav>
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex text-nowrap  block items-center w-full px-5 py-4 mb-1 rounded-xl text-left ${
                  isActive(item.path)
                    ? "bg-[#F47458] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span
                  className={`mr-3 ${
                    isActive(item.path)
                      ? "bg-[#F47458] text-white"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* General Menu */}
        <div className="p-4">
          <div className="text-sm font-medium text-gray-500 mb-4">General</div>
          <nav>
            {generalItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center w-full px-5 py-4 mb-1 rounded-xl text-left ${
                  isActive(item.path)
                    ? "bg-[#F47458] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span
                  className={`mr-3 ${
                    isActive(item.path)
                      ? "bg-[#F47458] text-white"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 mt-10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full cursor-pointer px-5 py-4 rounded-xl text-left text-gray-400 hover:bg-[#F47458] hover:text-white"
          >
            <span className="mr-3">
              <LogOut size={20} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>
      {/* Main Content Area - scrollable container */}
      <div className="flex-grow overflow-auto h-full">
        <Outlet />
      </div>
    </div>
  );
}
