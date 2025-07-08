"use client";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Camera, Upload, Check, AlertCircle, Loader2 } from "lucide-react";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Validating upload link...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Invalid Upload Link
          </h1>
          <p className="text-gray-600 mb-4">{uploadStatus}</p>
          <p className="text-sm text-gray-500">
            This link may have expired or been used already. Please generate a
            new QR code from your desktop.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Upload Photos
              </h1>
              <p className="text-sm text-gray-600">
                Add images to your BEX listing
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BEX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4">
        {/* Upload Status */}
        {uploadStatus && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              uploadStatus.includes("Successfully")
                ? "bg-green-50 text-green-800 border border-green-200"
                : uploadStatus.includes("failed") ||
                  uploadStatus.includes("Error")
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            <div className="flex items-center">
              {uploadStatus.includes("Successfully") && (
                <Check className="h-5 w-5 mr-2" />
              )}
              {(uploadStatus.includes("failed") ||
                uploadStatus.includes("Error")) && (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              {isUploading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              <span className="text-sm font-medium">{uploadStatus}</span>
            </div>
            {isUploading && uploadProgress > 0 && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {/* Upload Options */}
        <div className="space-y-4 mb-6">
          {/* Camera Button */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg flex items-center justify-center space-x-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Camera className="h-6 w-6" />
            <span>{isUploading ? "Uploading..." : "Take Photo"}</span>
          </button>

          {/* Gallery Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-gray-600 text-white py-4 px-6 rounded-lg font-medium text-lg flex items-center justify-center space-x-3 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Upload className="h-6 w-6" />
            <span>{isUploading ? "Uploading..." : "Choose from Gallery"}</span>
          </button>
        </div>

        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              Uploaded Images ({uploadedImages.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {uploadedImages.map((image, index) => (
                <div key={image.id || index} className="relative">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
                    <Check className="h-3 w-3" />
                  </div>
                  <p
                    className="text-xs text-gray-500 mt-1 truncate"
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
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            How it works:
          </h3>
          <ul className="text-xs text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">1.</span>
              Take clear, well-lit photos of your product
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">2.</span>
              Include multiple angles and important details
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">3.</span>
              Photos automatically appear on your desktop
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">4.</span>
              Continue adding more photos as needed
            </li>
          </ul>
        </div>

        {/* Tips */}
        <div className="mt-4 bg-orange-50 rounded-lg p-4 border border-orange-200">
          <h3 className="text-sm font-medium text-orange-900 mb-2">
            📸 Photo Tips:
          </h3>
          <ul className="text-xs text-orange-800 space-y-1">
            <li>• Use good lighting - natural light works best</li>
            <li>• Show the product from multiple angles</li>
            <li>• Include close-ups of important features</li>
            <li>• Keep the background clean and simple</li>
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
    </div>
  );
};

export default MobileUpload;
