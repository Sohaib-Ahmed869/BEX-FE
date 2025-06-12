import { useState, useEffect } from "react";
import registerationImage from "../../assets/startListingImage.png";
import SubmitProductsImage from "../../assets/AddProductImage.png";
import StartSellingImage from "../../assets/products.png";

export default function ListingSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps = [
    {
      number: "01",
      title: "Register Your Company",
      description: "Create your account and verify your business details.",
      color: "bg-[#f47458]",
      image: registerationImage,
    },
    {
      number: "02",
      title: "Submit Your Products",
      description:
        "Add your drilling tools with specifications, images, and pricing.",
      color: "bg-[#f47458]",
      image: SubmitProductsImage,
    },
    {
      number: "03",
      title: "Start Selling",
      description: "Your listings go live for buyers to discover and purchase.",
      color: "bg-[#f47458]",
      image: StartSellingImage,
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 my-30 bg-white">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Steps */}
        <div
          className={`flex-1 transition-all duration-1000 ease-out transform ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
          }`}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-regular text-gray-900 mb-2">
              How to start listing <span className="text-[#f47458]">BEX</span>
            </h2>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start gap-6  mb-15 transition-all duration-500 ease-in-out transform ${
                  activeStep === index
                    ? "scale-105 translate-x-2"
                    : "scale-100 translate-x-0"
                }`}
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              >
                {/* Step Number Circle */}
                <div
                  className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                    activeStep === index ? step.color : "bg-gray-300"
                  } ${activeStep === index ? "shadow-lg scale-110" : ""}`}
                >
                  {step.number}
                  {activeStep === index && (
                    <div
                      className={`absolute inset-0 rounded-full ${step.color} animate-ping opacity-30`}
                    ></div>
                  )}
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-6 mt-12 w-0.5 h-16 transition-colors duration-300 ${
                      activeStep >= index ? "bg-[#f47458]" : "bg-gray-200"
                    }`}
                    style={{ marginLeft: "-1px" }}
                  ></div>
                )}

                {/* Step Content */}
                <div
                  className={`flex-1 transition-all duration-300 ${
                    activeStep === index ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  <h3
                    className={`text-xl font-semibold mb-2 transition-all duration-300 ${
                      activeStep === index
                        ? "text-gray-900 scale-105"
                        : "text-gray-700"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-gray-600 leading-relaxed transition-all duration-300 ${
                      activeStep === index ? "opacity-100" : "opacity-75"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2 mt-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeStep === index
                    ? "w-8 bg-[#f47458] "
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Dynamic Image */}
        <div
          className={`flex-1 transition-all duration-1000 ease-out transform ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          }`}
        >
          <div className="relative">
            {/* Main Image Container with smooth height transitions */}
            <div className="bg-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out">
              {/* Dynamic Image based on active step */}
              <div className="relative overflow-hidden transition-all duration-500 ease-in-out">
                {steps.map((step, index) => (
                  <img
                    key={index}
                    src={step.image}
                    alt={step.title}
                    className={`w-full h-auto rounded-lg transition-all duration-500 ease-in-out transform ${
                      activeStep === index
                        ? "opacity-100 scale-100 translate-x-0"
                        : "opacity-0 scale-95 translate-x-4 absolute top-0 left-0"
                    }`}
                    style={{
                      maxHeight: "300px",
                      objectFit: "contain",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#f47458] rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
