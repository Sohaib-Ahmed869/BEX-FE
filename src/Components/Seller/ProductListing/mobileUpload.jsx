"use client";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Camera,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Star,
} from "lucide-react";
import logo from "../../../assets/logo.png";

const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const MobileUpload = () => {
  const { token } = useParams();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isValidToken, setIsValidToken] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const serverUrl = URL || "http://localhost:5000";
        const response = await fetch(
          `${serverUrl}/api/products/validate-upload-token/${token}`
        );
        const data = await response.json();
        setIsValidToken(data.valid);
        if (!data.valid) {
          setUploadStatus(
            data.message || "This upload link has expired or is invalid."
          );
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsValidToken(false);
        setUploadStatus("Error validating upload link.");
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus("Uploading images...");
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("token", token);

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const serverUrl = URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/api/products/mobile-upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadedImages((prev) => [...prev, ...result.images]);
        setUploadStatus(
          `Successfully uploaded ${result.images.length} image(s)`
        );
        setUploadProgress(100);

        // Show success message for a few seconds
        setTimeout(() => {
          setUploadStatus("");
          setUploadProgress(0);
        }, 3000);
      } else {
        setUploadStatus("Upload failed: " + result.message);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed. Please try again.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = (e) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
    e.target.value = "";
  };

  const handleGallerySelect = (e) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
    e.target.value = "";
  };

  // Loading state
  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white animate-spin" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/2 mx-auto"></div>
            </div>
          </div>
          <p className="text-gray-600 mt-6 animate-bounce">
            Validating upload link...
          </p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20 animate-fade-in">
          <div className="animate-bounce">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-4 animate-slide-up">
            Invalid Upload Link
          </h1>
          <p
            className="text-gray-600 mb-6 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            {uploadStatus}
          </p>
          <p
            className="text-sm text-gray-500 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            This link may have expired or been used already. Please generate a
            new QR code from your desktop.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="animate-slide-right">
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                Upload Photos
              </h1>
              <p className="text-sm text-gray-600">
                Add images to your BEX listing
              </p>
            </div>
            <div className="animate-slide-left">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  src={logo}
                  alt="BEX Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-6">
        {/* Upload Status */}
        {uploadStatus && (
          <div
            className={`mb-6 p-4 rounded-xl shadow-lg transform animate-slide-down ${
              uploadStatus.includes("Successfully")
                ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200"
                : uploadStatus.includes("failed") ||
                  uploadStatus.includes("Error")
                ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200"
                : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200"
            }`}
          >
            <div className="flex items-center">
              {uploadStatus.includes("Successfully") && (
                <Check className="h-5 w-5 mr-3 animate-bounce" />
              )}
              {(uploadStatus.includes("failed") ||
                uploadStatus.includes("Error")) && (
                <AlertCircle className="h-5 w-5 mr-3 animate-pulse" />
              )}
              {isUploading && <Loader2 className="h-5 w-5 mr-3 animate-spin" />}
              <span className="text-sm font-semibold">{uploadStatus}</span>
            </div>
            {isUploading && uploadProgress > 0 && (
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {/* Upload Options */}
        <div className="space-y-4 mb-8">
          {/* Camera Button */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-6 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-slide-up"
          >
            <Camera className="h-6 w-6" />
            <span>{isUploading ? "Uploading..." : "Take Photo"}</span>
          </button>

          {/* Gallery Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-5 px-6 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Upload className="h-6 w-6" />
            <span>{isUploading ? "Uploading..." : "Choose from Gallery"}</span>
          </button>
        </div>

        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                <Check className="h-4 w-4 text-white" />
              </div>
              Uploaded Images ({uploadedImages.length})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {uploadedImages.map((image, index) => (
                <div
                  key={image.id || index}
                  className="relative group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full p-2 shadow-lg animate-bounce">
                    <Check className="h-4 w-4" />
                  </div>
                  <p
                    className="text-xs text-gray-600 mt-2 truncate font-medium"
                    title={image.name}
                  >
                    {image.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg mb-6 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            How it works:
          </h3>
          <ul className="text-sm text-gray-700 space-y-3">
            <li className="flex items-start group">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 group-hover:scale-110 transition-transform">
                1
              </span>
              <span className="group-hover:text-gray-900 transition-colors">
                Take clear, well-lit photos of your product
              </span>
            </li>
            <li className="flex items-start group">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 group-hover:scale-110 transition-transform">
                2
              </span>
              <span className="group-hover:text-gray-900 transition-colors">
                Include multiple angles and important details
              </span>
            </li>
            <li className="flex items-start group">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 group-hover:scale-110 transition-transform">
                3
              </span>
              <span className="group-hover:text-gray-900 transition-colors">
                Photos automatically appear on your desktop
              </span>
            </li>
            <li className="flex items-start group">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 group-hover:scale-110 transition-transform">
                4
              </span>
              <span className="group-hover:text-gray-900 transition-colors">
                Continue adding more photos as needed
              </span>
            </li>
          </ul>
        </div>

        {/* Tips */}
        <div
          className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200 shadow-lg animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">📸</span>
            </div>
            Photo Tips:
          </h3>
          <ul className="text-sm text-orange-800 space-y-2">
            <li className="flex items-start hover:text-orange-900 transition-colors">
              <span className="text-orange-500 mr-2 font-bold">•</span>
              <span>Use good lighting - natural light works best</span>
            </li>
            <li className="flex items-start hover:text-orange-900 transition-colors">
              <span className="text-orange-500 mr-2 font-bold">•</span>
              <span>Show the product from multiple angles</span>
            </li>
            <li className="flex items-start hover:text-orange-900 transition-colors">
              <span className="text-orange-500 mr-2 font-bold">•</span>
              <span>Include close-ups of important features</span>
            </li>
            <li className="flex items-start hover:text-orange-900 transition-colors">
              <span className="text-orange-500 mr-2 font-bold">•</span>
              <span>Keep the background clean and simple</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={handleCameraCapture}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleGallerySelect}
      />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-slide-right {
          animation: slide-right 0.6s ease-out;
        }

        .animate-slide-left {
          animation: slide-left 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MobileUpload;
