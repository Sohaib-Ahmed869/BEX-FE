import React, { useEffect } from "react";
import image1 from "../../assets/LoginImages/image1.png";
import image2 from "../../assets/LoginImages/image2.png";
import image3 from "../../assets/LoginImages/image3.png";
import image4 from "../../assets/LoginImages/image4.png";
import image5 from "../../assets/LoginImages/image5.png";

const ImageGrid = () => {
  return (
    <div className="h-full w-full flex justify-center lg:justify-end items-center pr-2     relative ">
      <div className="flex gap-2 sm:gap-3 lg:gap-3 xl:gap-3 h-full max-h-screen py-1">
        {/* First column with 2 images */}
        <div className="flex flex-col justify-between gap-2 sm:gap-3 lg:gap-3 h-full">
          <div
            className="overflow-hidden rounded-lg flex-1 min-h-0"
            style={{
              opacity: 0,
              transform: "translateY(-20px)",
              animation: "fadeInDown 0.7s ease-out 0.2s forwards",
            }}
          >
            <img
              src={image1}
              alt="Login visual 1"
              className="w-full h-full object-cover min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[160px] xl:min-w-[180px]"
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
          <div
            className="overflow-hidden rounded-lg flex-1 min-h-0"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              animation: "fadeInUp 0.7s ease-out 0.4s forwards",
            }}
          >
            <img
              src={image2}
              alt="Login visual 2"
              className="w-full h-full object-cover min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[160px] xl:min-w-[180px]"
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
        </div>

        {/* Second column with 3 images */}
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-3 justify-between h-full">
          <div
            className="overflow-hidden rounded-lg flex-1 min-h-0"
            style={{
              opacity: 0,
              transform: "translateX(20px)",
              animation: "fadeInRight 0.7s ease-out 0.3s forwards",
            }}
          >
            <img
              src={image3}
              alt="Login visual 3"
              className="w-full h-full object-cover min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[160px] xl:min-w-[180px]"
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
          <div
            className="overflow-hidden rounded-lg flex-1 min-h-0"
            style={{
              opacity: 0,
              transform: "translateX(20px)",
              animation: "fadeInRight 0.7s ease-out 0.5s forwards",
            }}
          >
            <img
              src={image4}
              alt="Login visual 4"
              className="w-full h-full object-cover min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[160px] xl:min-w-[180px]"
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
          <div
            className="overflow-hidden rounded-lg flex-1 min-h-0"
            style={{
              opacity: 0,
              transform: "translateX(20px)",
              animation: "fadeInRight 0.7s ease-out 0.7s forwards",
            }}
          >
            <img
              src={image5}
              alt="Login visual 5"
              className="w-full h-full object-cover min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[160px] xl:min-w-[180px]"
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .min-w-\\[160px\\] {
            min-width: 140px;
          }
        }

        @media (max-width: 768px) {
          .min-w-\\[140px\\] {
            min-width: 120px;
          }
        }

        @media (max-width: 640px) {
          .min-w-\\[120px\\] {
            min-width: 100px;
          }
        }

        /* Ensure proper aspect ratios on smaller screens */
        @media (max-height: 700px) {
          .flex-1 {
            min-height: 80px;
          }
        }

        @media (min-height: 900px) {
          .flex-1 {
            min-height: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageGrid;
