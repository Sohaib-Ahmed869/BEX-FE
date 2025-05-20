import React, { useEffect } from "react";
import image1 from "../../assets/LoginImages/image1.png";
import image2 from "../../assets/LoginImages/image2.png";
import image3 from "../../assets/LoginImages/image3.png";
import image4 from "../../assets/LoginImages/image4.png";
import image5 from "../../assets/LoginImages/image5.png";

const ImageGrid = () => {
  return (
    <div className="h-full flex justify-end items-center pr-8 relative ">
      <div className="flex gap-5 h-full">
        {/* First column with 2 images */}
        <div className="flex flex-col justify-between  gap-4 ">
          <div
            className="overflow-hidden rounded-lg"
            style={{
              opacity: 0,
              transform: "translateY(-20px)",
              animation: "fadeInDown 0.7s ease-out 0.2s forwards",
            }}
          >
            <img
              src={image1}
              alt="image"
              className="mb-4 w-full h-auto object-cover"
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
          <div
            className="overflow-hidden rounded-lg"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              animation: "fadeInUp 0.7s ease-out 0.4s forwards",
            }}
          >
            <img
              src={image2}
              alt="image"
              className="w-full h-auto object-cover"
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
        <div className="flex flex-col gap-4 justify-between">
          <div
            className="overflow-hidden rounded-lg"
            style={{
              opacity: 0,
              transform: "translateX(20px)",
              animation: "fadeInRight 0.7s ease-out 0.3s forwards",
            }}
          >
            <img
              src={image3}
              alt="image"
              className="w-full h-auto object-cover"
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
          <div
            className="overflow-hidden rounded-lg"
            style={{
              opacity: 0,
              transform: "translateX(20px)",
              animation: "fadeInRight 0.7s ease-out 0.5s forwards",
            }}
          >
            <img
              src={image4}
              alt="image"
              className="w-full h-auto object-cover"
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
          <div
            className="overflow-hidden rounded-lg"
            style={{
              opacity: 0,
              transform: "translateX(20px)",
              animation: "fadeInRight 0.7s ease-out 0.7s forwards",
            }}
          >
            <img
              src={image5}
              alt="image"
              className="w-full h-auto object-cover"
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
      `}</style>
    </div>
  );
};

export default ImageGrid;
