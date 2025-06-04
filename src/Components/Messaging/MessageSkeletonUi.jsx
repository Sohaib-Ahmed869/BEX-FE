import React from "react";

export const MessageSkeleton = () => (
  <div className="space-y-4 p-4">
    <style jsx>{`
      @keyframes shimmer {
        0% {
          background-position: -200px 0;
        }
        100% {
          background-position: calc(200px + 100%) 0;
        }
      }

      @keyframes wave {
        0%,
        100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-3px);
        }
      }

      @keyframes wobble {
        0%,
        100% {
          transform: scale(1) rotate(0deg);
        }
        25% {
          transform: scale(1.02) rotate(0.5deg);
        }
        75% {
          transform: scale(0.98) rotate(-0.5deg);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .shimmer {
        background: linear-gradient(
          90deg,
          #f0f0f0 25%,
          #e0e0e0 50%,
          #f0f0f0 75%
        );
        background-size: 200px 100%;
        animation: shimmer 1.5s infinite linear;
      }

      .wave-animation {
        animation: wave 2s ease-in-out infinite;
      }

      .wobble-animation {
        animation: wobble 3s ease-in-out infinite;
      }

      .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
      }

      .skeleton-line {
        position: relative;
        overflow: hidden;
        border-radius: 6px;
      }

      .skeleton-line::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.6),
          transparent
        );
        animation: shimmer 2s infinite;
      }

      .message-bubble {
        position: relative;
        overflow: hidden;
      }

      .message-bubble::after {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.4),
          transparent
        );
        animation: shimmer 2.5s infinite;
      }
    `}</style>

    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`flex ${
          i % 2 === 0 ? "justify-end" : "justify-start"
        } fade-in`}
        style={{
          animationDelay: `${i * 0.1}s`,
          opacity: 0,
        }}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl message-bubble wobble-animation ${
            i % 2 === 0
              ? "bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm"
              : "bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm"
          }`}
          style={{
            animationDelay: `${i * 0.3}s`,
          }}
        >
          {/* Main text lines */}
          <div className="space-y-2">
            <div
              className={`skeleton-line wave-animation ${
                i % 2 === 0 ? "bg-blue-300" : "bg-gray-300"
              }`}
              style={{
                height: "16px",
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>

            <div
              className={`skeleton-line wave-animation ${
                i % 2 === 0 ? "bg-blue-300" : "bg-gray-300"
              }`}
              style={{
                height: "16px",
                width: "75%",
                animationDelay: `${i * 0.1 + 0.2}s`,
              }}
            ></div>

            {/* Random third line for some messages */}
            {Math.random() > 0.4 && (
              <div
                className={`skeleton-line wave-animation ${
                  i % 2 === 0 ? "bg-blue-200" : "bg-gray-200"
                }`}
                style={{
                  height: "14px",
                  width: `${40 + Math.random() * 30}%`,
                  animationDelay: `${i * 0.1 + 0.4}s`,
                }}
              ></div>
            )}
          </div>

          {/* Timestamp */}
          <div className="mt-2 flex justify-end">
            <div
              className={`skeleton-line wave-animation ${
                i % 2 === 0 ? "bg-blue-200" : "bg-gray-200"
              }`}
              style={{
                height: "12px",
                width: "64px",
                animationDelay: `${i * 0.1 + 0.6}s`,
              }}
            ></div>
          </div>
        </div>
      </div>
    ))}

    {/* Typing indicator */}
    <div
      className="flex justify-start fade-in"
      style={{ animationDelay: "0.5s", opacity: 0 }}
    >
      <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm">
        <div className="flex items-center space-x-1">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full wave-animation"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full wave-animation"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full wave-animation"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

export const ChatSkeleton = () => (
  <div className="space-y-1 p-2">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center p-3 animate-pulse">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    ))}
  </div>
);
