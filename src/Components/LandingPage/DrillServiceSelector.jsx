import React, { useState } from "react";
import drillIcon1 from "../../assets/drill-icon-1.png";
import drillIcon2 from "../../assets/drill-icon-2.png";
import { Link, Navigate } from "react-router-dom";
const DrillServiceSelector = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="flex  flex-wrap gap-y-10 gap-6 p-8  py-30 items-center justify-center">
      {/* Looking for a Drill Card */}
      <div
        className={`relative  rounded-2xl p-8 w-80 h-66 transition-all duration-300 ease-out cursor-pointer ${
          hoveredCard === "looking"
            ? "transform -translate-y-2 shadow-xl"
            : "shadow-lg"
        }`}
        onMouseEnter={() => setHoveredCard("looking")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="flex flex-col justify-between ">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 leading-tight">
              Are You Looking
              <br />
              For a Drill ?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We are committed to providing our customers with
              <br />
              exceptional service.
            </p>
          </div>

          <div className="flex items-end justify-between">
            <Link
              to="/products"
              className={`bg-orange-500 bottom-[-10px] relative hover:bg-orange-600  text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                hoveredCard === "looking" ? "transform scale-105" : ""
              }`}
            >
              Get Started
            </Link>

            <div
              className={`transition-transform duration-300 ${
                hoveredCard === "looking" ? "transform rotate-12 scale-110" : ""
              }`}
            >
              <img src={drillIcon1} alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* Want to Sell a Drill Card */}
      <div
        className={`relative bg-blue-50 rounded-2xl p-8 w-80 h-66 transition-all duration-300 ease-out cursor-pointer ${
          hoveredCard === "selling"
            ? "transform -translate-y-2 shadow-xl"
            : "shadow-lg"
        }`}
        onMouseEnter={() => setHoveredCard("selling")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 leading-tight">
              Do You Want to
              <br />
              Sell a Drill?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We are committed to providing our customers with
              <br />
              exceptional service.
            </p>
          </div>

          <div className="flex items-end justify-between">
            <Link
              to={"/products"}
              className={`bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                hoveredCard === "selling" ? "transform scale-105" : ""
              }`}
            >
              Get Started
            </Link>

            <div
              className={`transition-transform duration-300 ${
                hoveredCard === "selling"
                  ? "transform -rotate-12 scale-110"
                  : ""
              }`}
            >
              <img src={drillIcon2} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrillServiceSelector;
