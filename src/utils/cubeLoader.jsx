import { useState, useEffect } from "react";

const CubeLoader = () => {
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(15);
  const [rotationZ, setRotationZ] = useState(5);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(function animate() {
      setRotationY((prev) => (prev + 2.5) % 360);
      setRotationX((prev) => (prev + 1.2) % 360);
      setRotationZ((prev) => (prev + 0.8) % 360);
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center fixed backdrop-blur-xs  z-20 top-0 left-0 w-full h-full">
      <div className="perspective-30 relative">
        <div
          className="w-20 h-20 relative"
          style={{
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`,
            transformStyle: "preserve-3d",
            perspective: "800px",
          }}
        >
          {/* Front face */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-orange-300 to-orange-400"
            style={{
              transform: "translateZ(2.5rem)",
              boxShadow: "0 0 15px rgba(0,0,0,0.15)",
            }}
          />

          {/* Back face */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-orange-400 to-orange-500"
            style={{
              transform: "rotateY(180deg) translateZ(2.5rem)",
              boxShadow: "0 0 15px rgba(0,0,0,0.15)",
            }}
          />

          {/* Left face */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-orange-400 to-orange-500"
            style={{
              transform: "rotateY(-90deg) translateZ(2.5rem)",
              boxShadow: "0 0 15px rgba(0,0,0,0.15)",
            }}
          />

          {/* Right face */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-orange-500 to-orange-600"
            style={{
              transform: "rotateY(90deg) translateZ(2.5rem)",
              boxShadow: "0 0 15px rgba(0,0,0,0.15)",
            }}
          />

          {/* Top face */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-orange-200 to-orange-300"
            style={{
              transform: "rotateX(90deg) translateZ(2.5rem)",
              boxShadow: "0 0 15px rgba(0,0,0,0.15)",
            }}
          />

          {/* Bottom face */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-orange-500 to-orange-600"
            style={{
              transform: "rotateX(-90deg) translateZ(2.5rem)",
              boxShadow: "0 0 15px rgba(0,0,0,0.15)",
            }}
          />
        </div>
      </div>

      <p className="mt-10 text-gray-800 font-medium text-lg">
        Processing Please wait...
      </p>
    </div>
  );
};

export default CubeLoader;
