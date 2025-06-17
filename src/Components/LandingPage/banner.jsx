import {
  User,
  Menu,
  X,
  ShoppingBag,
  LayoutDashboardIcon,
  GitGraphIcon,
  PieChartIcon,
} from "lucide-react";
import { useState } from "react";
import logo from "../../assets/mainLogo.png";
import bannerImg from "../../assets/banner.png";
import { Link } from "react-router-dom";

const Banner = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0  "></div>
      </div>

      {/* Header */}
      <header className="relative  max-w-[80%]   rounded-full mt-5 mx-auto z-50 flex justify-between items-center py-4 lg:p-6 bg-[#00000067] ">
        {/* Logo */}
        <div className="transform hover:scale-105 transition-transform duration-300">
          <img
            src={logo}
            alt="Logo"
            className="h-8 lg:h-10 w-auto animate-fade-in"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            <li>
              <Link
                to={
                  token && role === "admin"
                    ? "/admin/dashboard"
                    : token && role === "seller"
                    ? "/seller/dashboard"
                    : "/login "
                }
                className="flex items-center text-white hover:text-orange-400 transition-all duration-300 px-4 py-2   hover:bg-opacity-10"
              >
                {" "}
                {!token ? (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                ) : (
                  <>
                    {role === "buyer" ? (
                      <>
                        <ShoppingBag className="mr-2 h-4 w-4" /> Browse Products
                      </>
                    ) : role === "seller" || role === "admin" ? (
                      <>
                        <PieChartIcon className="mr-2 h-4 w-4" /> Continue to
                        Dashboard
                      </>
                    ) : (
                      <>
                        {" "}
                        <User className="mr-2 h-4 w-4" />
                        Sign in
                      </>
                    )}{" "}
                  </>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:text-orange-400 transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute top-full left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md transition-all duration-300 transform ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          } md:hidden`}
        >
          <nav className="p-4">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/login"
                  className="flex items-center text-white hover:text-orange-400 transition-all duration-300 px-4 py-3  rounded-lg hover:border-orange-400 hover:bg-orange-400 hover:bg-opacity-10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Banner Content */}
      <div className="relative z-40 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-up">
            Find the Perfect Drilling Tools with AI
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            Simply describe your concrete drilling job, and we'll recommend the
            exact tools you need
          </p>

          {/* Search Input */}
          <div className="mb-8 animate-slide-up animation-delay-400">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Describe your job (e.g. Im drilling 5cm holes in 15cm concrete, I need 25m of )"
                className="w-full px-6 py-4 rounded-full text-gray-800 bg-white bg-opacity-95 backdrop-blur-sm border-0 focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-50 transition-all duration-300 text-sm md:text-base"
              />
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-12 animate-slide-up animation-delay-600">
            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-50">
              Find My Tools
            </button>
          </div>

          {/* Example Queries */}
          <div className="animate-slide-up animation-delay-800">
            <p className="text-gray-400 mb-4 text-sm md:text-base">
              Try these examples:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 border border-white border-opacity-20 hover:border-orange-400">
                "I need to drill holes for rebar in concrete for earthquake
                strengthening"
              </button>
              <button className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 border border-white border-opacity-20 hover:border-orange-400">
                "Looking for diamond saw blades for granite countertops"
              </button>
              <button className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 border border-white border-opacity-20 hover:border-orange-400">
                "I'm drilling 500 holes in structural concrete, I need 25A+
                bits"
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
};

export default Banner;
