"use client";
import { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  ChevronDown,
  ImageIcon,
  XCircle,
  Smartphone,
  QrCode,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  generateUploadToken,
  generateQRCode,
} from "../../../utils/qrCodeGenerator";
import io from "socket.io-client";

const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const MediaUploadComponent = ({ formData, setFormData }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // QR Code states
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState(null);
  const [uploadToken, setUploadToken] = useState(null);
  const [qrCodeExpiry, setQRCodeExpiry] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [mobileUploadsCount, setMobileUploadsCount] = useState(0);

  // Socket states
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection to upload namespace
  useEffect(() => {
    const serverUrl = URL || "http://localhost:5000";
    console.log("Connecting to upload socket:", `${serverUrl}/uploads`);

    // Connect to the uploads namespace
    const newSocket = io(`${serverUrl}/uploads`, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Upload socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log("Upload socket disconnected:", reason);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Upload socket connection error:", error);
      setIsConnected(false);
    });

    newSocket.on("connection-confirmed", (data) => {
      console.log("Upload connection confirmed:", data);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Listen for mobile uploads
  useEffect(() => {
    if (socket && uploadToken && isConnected) {
      const eventName = `mobile-upload-${uploadToken}`;
      console.log("Listening for upload event:", eventName);

      const handleMobileUpload = (imageData) => {
        console.log("Received mobile upload:", imageData);

        if (!imageData || !imageData.url || !imageData.name) {
          console.error("Invalid image data:", imageData);
          return;
        }

        const newImage = {
          file: null,
          preview: imageData.url,
          name: imageData.name,
          fromMobile: true,
          mobileUploadId: imageData.id,
          uploadedAt: imageData.uploadedAt,
          isTemp: true,
          tempUrl: imageData.url,
          size: imageData.size || 0,
        };

        setFormData((prevFormData) => ({
          ...prevFormData,
          uploadedImages: [...(prevFormData.uploadedImages || []), newImage],
        }));

        setMobileUploadsCount((prev) => prev + 1);
      };

      socket.on(eventName, handleMobileUpload);

      // Register token with socket
      socket.emit("register-upload-token", {
        token: uploadToken,
        userId: localStorage.getItem("userId") || "anonymous",
      });

      return () => {
        socket.off(eventName, handleMobileUpload);
        socket.emit("cleanup-upload-token", { token: uploadToken });
      };
    }
  }, [socket, uploadToken, isConnected, setFormData]);

  // QR code expiry timer
  useEffect(() => {
    let interval;
    if (qrCodeExpiry && showQRCode) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const remaining = Math.max(0, qrCodeExpiry - now);
        setTimeRemaining(remaining);
        if (remaining === 0) {
          handleCloseQRCode();
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [qrCodeExpiry, showQRCode]);

  const handleGenerateQRCode = async () => {
    try {
      if (!isConnected) {
        alert("Socket connection not established. Please wait and try again.");
        return;
      }

      const token = generateUploadToken();
      const qrCode = await generateQRCode(token);

      if (qrCode) {
        setUploadToken(token);
        setQRCodeData(qrCode);
        setShowQRCode(true);
        setMobileUploadsCount(0);

        const expiry = new Date().getTime() + 10 * 60 * 1000;
        setQRCodeExpiry(expiry);
        setTimeRemaining(10 * 60 * 1000);

        // Register token with backend
        const serverUrl = URL || "http://localhost:5000";
        const response = await fetch(
          `${serverUrl}/api/products/register-upload-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              expiresAt: new Date(expiry).toISOString(),
            }),
          }
        );

        const result = await response.json();
        if (result.success) {
          console.log("Token registered successfully:", token);
        }
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    }
  };

  const handleCloseQRCode = () => {
    if (socket && uploadToken) {
      socket.emit("cleanup-upload-token", { token: uploadToken });
    }
    setShowQRCode(false);
    setQRCodeData(null);
    setUploadToken(null);
    setQRCodeExpiry(null);
    setTimeRemaining(0);
    setMobileUploadsCount(0);
  };

  const formatTimeRemaining = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Desktop file upload
  const handleFileUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessingFile) return;

    setIsProcessingFile(true);

    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newImages = files.map((file) => ({
        file: file,
        preview: URL.createObjectURL(file),
        name: file.name,
        fromMobile: false,
        isTemp: false,
        size: file.size,
      }));

      setFormData((prevFormData) => ({
        ...prevFormData,
        uploadedImages: [...(prevFormData.uploadedImages || []), ...newImages],
      }));

      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setIsProcessingFile(false);
      }, 300);
    } else {
      setIsProcessingFile(false);
    }
  };

  const removeImage = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const updatedImages = [...formData.uploadedImages];
    const imageToRemove = updatedImages[index];

    if (
      imageToRemove?.preview &&
      !imageToRemove?.fromMobile &&
      imageToRemove?.file
    ) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    updatedImages.splice(index, 1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      uploadedImages: updatedImages,
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessingFile) return;

    setIsProcessingFile(true);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const newImages = files.map((file) => ({
        file: file,
        preview: URL.createObjectURL(file),
        name: file.name,
        fromMobile: false,
        isTemp: false,
        size: file.size,
      }));

      setFormData((prevFormData) => ({
        ...prevFormData,
        uploadedImages: [...(prevFormData.uploadedImages || []), ...newImages],
      }));
    }

    setTimeout(() => {
      setIsProcessingFile(false);
    }, 300);
  };

  const openImageModal = (image, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedImage(image);
  };

  const closeImageModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedImage(null);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-3 sm:p-4 md:p-6 w-full max-w-full overflow-hidden">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
        Media upload
      </h2>

      {/* Debug info for development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          <p>Upload Socket Connected: {isConnected ? "✅" : "❌"}</p>
          <p>Socket ID: {socket?.id || "N/A"}</p>
          <p>Upload Token: {uploadToken || "N/A"}</p>
          <p>Mobile Uploads: {mobileUploadsCount}</p>
        </div>
      )}

      {/* QR Code Upload Section */}
      <div className="mb-4 sm:mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                Upload from Phone
              </h3>
              <p className="text-xs text-blue-700">
                Scan QR code to upload photos directly
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" title="Connected" />
              ) : (
                <WifiOff
                  className="h-4 w-4 text-red-500"
                  title="Disconnected"
                />
              )}
            </div>
            {!showQRCode && (
              <button
                type="button"
                onClick={handleGenerateQRCode}
                disabled={!isConnected}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                <QrCode className="h-4 w-4 mr-1" />
                Show QR Code
              </button>
            )}
          </div>
        </div>

        {!isConnected && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            ⚠️ Upload socket connection issue. Mobile uploads may not work
            properly.
          </div>
        )}

        {showQRCode && qrCodeData && (
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg inline-block shadow-sm border">
              <img
                src={qrCodeData || "/placeholder.svg"}
                alt="QR Code for mobile upload"
                className="mx-auto"
              />
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600">
                  Scan with your phone to upload photos
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <span className="text-red-600">
                    Expires: {formatTimeRemaining(timeRemaining)}
                  </span>
                  {mobileUploadsCount > 0 && (
                    <span className="text-green-600">
                      {mobileUploadsCount} uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseQRCode}
              className="mt-3 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Hide QR Code
            </button>
          </div>
        )}
      </div>

      {/* Rest of your component - desktop upload, image gallery, etc. */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center">
          Upload from Computer
          <div className="ml-2 bg-orange-100 text-orange-500 rounded-full p-0.5">
            <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
        </label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-6 mb-3 sm:mb-4 cursor-pointer hover:border-orange-300 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-orange-500 mb-2" />
            <p className="text-center mb-2 text-xs sm:text-sm md:text-base px-2">
              Select your file or drag and drop
            </p>
            <p className="text-xs text-gray-500 mb-3 sm:mb-4 text-center">
              png, jpg, jpeg accepted
            </p>
            <button
              type="button"
              className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-orange-600 text-xs sm:text-sm font-medium transition-colors"
              disabled={isProcessingFile}
            >
              {isProcessingFile ? "Processing..." : "Browse"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Image Gallery */}
        {formData.uploadedImages && formData.uploadedImages.length > 0 && (
          <div className="mt-3 sm:mt-4 w-full overflow-x-hidden">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
              <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Uploaded Images ({formData.uploadedImages.length})
              {mobileUploadsCount > 0 && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {mobileUploadsCount} from mobile
                </span>
              )}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 w-full">
              {formData.uploadedImages.map((image, index) => (
                <div
                  key={`img-${index}-${image.name}`}
                  className="relative group w-full"
                >
                  <div
                    className="aspect-square rounded-md shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={(e) => openImageModal(image, e)}
                  >
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                    {image.fromMobile && (
                      <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                        <Smartphone className="h-3 w-3 mr-1" />
                        Mobile
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => removeImage(index, e)}
                    className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-600 group-hover:opacity-100 opacity-70 sm:opacity-0 transition-opacity"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                  <p
                    className="text-xs mt-1 text-gray-500 truncate"
                    title={image.name}
                  >
                    {image.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={closeImageModal}
        >
          <div
            className="relative bg-white rounded-lg w-full h-full sm:w-auto sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-sm sm:text-lg font-medium truncate mr-2 flex-1">
                {selectedImage.name}
                {selectedImage.fromMobile && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Mobile Upload
                  </span>
                )}
              </h3>
              <button
                onClick={closeImageModal}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3 sm:p-4 flex items-center justify-center min-h-0">
              <img
                src={selectedImage.preview || "/placeholder.svg"}
                alt={selectedImage.name}
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* List for selling option */}
      <div className="mt-4 sm:mt-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Do you want to list product for selling?
        </label>
        <div className="relative w-full sm:w-auto sm:max-w-xs">
          <select
            className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-md appearance-none text-sm bg-white"
            value={formData.listForSelling || "Yes"}
            onChange={(e) =>
              handleInputChange("listForSelling", e.target.value)
            }
          >
            <option>Yes</option>
            <option>No</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default MediaUploadComponent;
