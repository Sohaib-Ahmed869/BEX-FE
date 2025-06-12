import React from "react";
import logo from "../../assets/mainLogo.png";
const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 relative overflow-hidden">
        {/* Top animated line */}
        <div className="absolute top-0 left-0 w-full h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand Section - Takes more space */}
            <div className="lg:col-span-2 opacity-0 translate-y-8 animate-[fadeInUp_0.8s_ease-out_0.1s_forwards]">
              {/* Logo */}
              <div className=" ">
                <img src={logo} alt="" />
              </div>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed mb-8 text-sm max-w-md">
                Lorem ipsum dolor sit amet, sed diam nonumy eirmod tempor
                invidunt ut labore et dolore magna aliquyam erat, sed diam
                voluptua. At vero eos et accusam et justo duo dolores et ea
                rebum.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center text-gray-400 text-sm group hover:text-indigo-400 transition-all duration-300 cursor-pointer">
                  <div className="w-6 h-6 mr-4 flex items-center justify-center bg-gray-800 rounded-full transition-all duration-300 group-hover:bg-indigo-600 group-hover:scale-110">
                    <span className="text-xs">✉</span>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    hello@mrbex@gmail.com
                  </span>
                </div>

                <div className="flex items-center text-gray-400 text-sm group hover:text-indigo-400 transition-all duration-300 cursor-pointer">
                  <div className="w-6 h-6 mr-4 flex items-center justify-center bg-gray-800 rounded-full transition-all duration-300 group-hover:bg-indigo-600 group-hover:scale-110">
                    <span className="text-xs">📞</span>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    +19 3498 7960
                  </span>
                </div>

                <div className="flex items-center text-gray-400 text-sm group hover:text-indigo-400 transition-all duration-300 cursor-pointer">
                  <div className="w-6 h-6 mr-4 flex items-center justify-center bg-gray-800 rounded-full transition-all duration-300 group-hover:bg-indigo-600 group-hover:scale-110">
                    <span className="text-xs">📍</span>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    Lorem ipsum dolor sit
                    <br />
                    amet
                  </span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className="opacity-0 translate-y-8 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
              <h3 className="text-gray-200 text-sm font-semibold mb-6 relative group tracking-wide">
                Company
                <div className="absolute bottom-[-6px] left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 group-hover:w-6"></div>
              </h3>

              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-indigo-300 transition-all duration-300 relative group inline-block"
                  >
                    <span className="absolute top-1/2 left-[-12px] w-0 h-px bg-indigo-500 transition-all duration-300 transform -translate-y-1/2 group-hover:w-2"></span>
                    <span className="group-hover:translate-x-3 transition-transform duration-300 inline-block">
                      About
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-indigo-300 transition-all duration-300 relative group inline-block"
                  >
                    <span className="absolute top-1/2 left-[-12px] w-0 h-px bg-indigo-500 transition-all duration-300 transform -translate-y-1/2 group-hover:w-2"></span>
                    <span className="group-hover:translate-x-3 transition-transform duration-300 inline-block">
                      Blog
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-indigo-300 transition-all duration-300 relative group inline-block"
                  >
                    <span className="absolute top-1/2 left-[-12px] w-0 h-px bg-indigo-500 transition-all duration-300 transform -translate-y-1/2 group-hover:w-2"></span>
                    <span className="group-hover:translate-x-3 transition-transform duration-300 inline-block">
                      Join Us
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Orders Links */}
            <div className="opacity-0 translate-y-8 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]">
              <h3 className="text-gray-200 text-sm font-semibold mb-6 relative group tracking-wide">
                Orders
                <div className="absolute bottom-[-6px] left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 group-hover:w-6"></div>
              </h3>

              <ul className="space-y-4 mb-10">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-indigo-300 transition-all duration-300 relative group inline-block"
                  >
                    <span className="absolute top-1/2 left-[-12px] w-0 h-px bg-indigo-500 transition-all duration-300 transform -translate-y-1/2 group-hover:w-2"></span>
                    <span className="group-hover:translate-x-3 transition-transform duration-300 inline-block">
                      Your orders
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-indigo-300 transition-all duration-300 relative group inline-block"
                  >
                    <span className="absolute top-1/2 left-[-12px] w-0 h-px bg-indigo-500 transition-all duration-300 transform -translate-y-1/2 group-hover:w-2"></span>
                    <span className="group-hover:translate-x-3 transition-transform duration-300 inline-block">
                      Track orders
                    </span>
                  </a>
                </li>
              </ul>

              <h3 className="text-gray-200 text-sm font-semibold mb-6 relative group tracking-wide">
                Legal
                <div className="absolute bottom-[-6px] left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 group-hover:w-6"></div>
              </h3>

              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-indigo-300 transition-all duration-300 relative group inline-block"
                  >
                    <span className="absolute top-1/2 left-[-12px] w-0 h-px bg-indigo-500 transition-all duration-300 transform -translate-y-1/2 group-hover:w-2"></span>
                    <span className="group-hover:translate-x-3 transition-transform duration-300 inline-block">
                      Claim
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-indigo-300 transition-all duration-300 relative group inline-block"
                  >
                    <span className="absolute top-1/2 left-[-12px] w-0 h-px bg-indigo-500 transition-all duration-300 transform -translate-y-1/2 group-hover:w-2"></span>
                    <span className="group-hover:translate-x-3 transition-transform duration-300 inline-block">
                      Privacy
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-indigo-300 transition-all duration-300 relative group inline-block"
                  >
                    <span className="absolute top-1/2 left-[-12px] w-0 h-px bg-indigo-500 transition-all duration-300 transform -translate-y-1/2 group-hover:w-2"></span>
                    <span className="group-hover:translate-x-3 transition-transform duration-300 inline-block">
                      Terms
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 mt-16 pt-8 text-center relative">
            <div className="absolute top-0 left-1/2 w-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse transform -translate-x-1/2 transition-all duration-1000 hover:w-32"></div>
            <p className="text-gray-500 text-xs tracking-wide">
              Designed by some ©{" "}
              <span className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 cursor-pointer">
                MRBEXDEV
              </span>{" "}
              2024. All rights reserved.
            </p>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </footer>
    </>
  );
};

export default Footer;
