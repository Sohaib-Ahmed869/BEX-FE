// import React, { useState, useRef, useEffect } from "react";
// import { Upload, X, ChevronDown, Image, XCircle } from "lucide-react";

// const MediaUploadComponent = ({ formData, setFormData }) => {
//   const fileInputRef = useRef(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isProcessingFile, setIsProcessingFile] = useState(false);

//   // Completely revised file upload handler to fix the double-open issue
//   const handleFileUpload = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     // Prevent processing if already handling files
//     if (isProcessingFile) {
//       return;
//     }

//     setIsProcessingFile(true);

//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);

//       const newImages = files.map((file) => {
//         const previewUrl = URL.createObjectURL(file);

//         return {
//           file: file,
//           preview: previewUrl,
//           name: file.name,
//         };
//       });

//       // Update form data with new images
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         uploadedImages: [...(prevFormData.uploadedImages || []), ...newImages],
//       }));

//       // Clear the file input value to ensure it triggers even if same file is selected again
//       setTimeout(() => {
//         if (fileInputRef.current) {
//           fileInputRef.current.value = "";
//           setIsProcessingFile(false);
//         }
//       }, 300);
//     } else {
//       setIsProcessingFile(false);
//     }
//   };

//   // Remove uploaded image
//   const removeImage = (index, e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }

//     const updatedImages = [...formData.uploadedImages];

//     // Revoke the object URL to prevent memory leaks
//     if (updatedImages[index]?.preview) {
//       URL.revokeObjectURL(updatedImages[index].preview);
//     }

//     updatedImages.splice(index, 1);
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       uploadedImages: updatedImages,
//     }));
//   };

//   // Updated drag and drop handler
//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (isProcessingFile) {
//       return;
//     }

//     setIsProcessingFile(true);

//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const files = Array.from(e.dataTransfer.files);

//       // Create file previews and store file objects for backend upload
//       const newImages = files.map((file) => {
//         // Create a preview URL for display
//         const previewUrl = URL.createObjectURL(file);

//         // Return an object with both the file and preview URL
//         return {
//           file: file, // Original file for S3 upload
//           preview: previewUrl, // URL for preview
//           name: file.name, // Filename for display
//         };
//       });

//       // Update form data with new images
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         uploadedImages: [...(prevFormData.uploadedImages || []), ...newImages],
//       }));
//     }

//     setTimeout(() => {
//       setIsProcessingFile(false);
//     }, 300);
//   };

//   // Function to open image modal
//   const openImageModal = (image, e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     setSelectedImage(image);
//   };

//   // Function to close image modal
//   const closeImageModal = (e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     setSelectedImage(null);
//   };

//   const handleInputChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   // Separate click handler for the browse button
//   const handleBrowseClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (isProcessingFile) {
//       return;
//     }

//     // Directly handle the file input click
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Prevent the drop zone from triggering the file input
//   const handleDropZoneClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (isProcessingFile) {
//       return;
//     }

//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   return (
//     <div className="bg-white border border-gray-100 rounded-lg p-3 sm:p-4 md:p-6 w-full max-w-full overflow-hidden">
//       <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
//         Media upload
//       </h2>

//       <div className="mb-4 sm:mb-6">
//         <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center">
//           Upload your media
//           <div className="ml-2 bg-orange-100 text-orange-500 rounded-full p-0.5">
//             <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
//           </div>
//         </label>

//         <div
//           className="border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-6 mb-3 sm:mb-4 cursor-pointer touch-manipulation"
//           onClick={handleDropZoneClick}
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={handleDrop}
//         >
//           <div className="flex flex-col items-center">
//             <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-orange-500 mb-2" />
//             <p className="text-center mb-2 text-xs sm:text-sm md:text-base px-2">
//               Select your file or drag and drop
//             </p>
//             <p className="text-xs text-gray-500 mb-3 sm:mb-4 text-center">
//               png, jpg, jpeg accepted
//             </p>
//             <button
//               type="button"
//               className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md cursor-pointer hover:bg-orange-600 text-xs sm:text-sm font-medium touch-manipulation active:bg-orange-700 transition-colors"
//               onClick={handleBrowseClick}
//               disabled={isProcessingFile}
//             >
//               Browse
//             </button>
//             {/* Hidden file input - completely separate from the browse button */}
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               accept="image/*"
//               className="hidden"
//               onChange={handleFileUpload}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>
//         </div>

//         {/* Enhanced Image gallery with mobile-first responsive grid */}
//         {formData.uploadedImages && formData.uploadedImages.length > 0 && (
//           <div className="mt-3 sm:mt-4 w-full overflow-x-hidden">
//             <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
//               <Image className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//               Uploaded Images ({formData.uploadedImages.length})
//             </h3>
//             {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 4-5 columns */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 w-full">
//               {formData.uploadedImages.map((image, index) => (
//                 <div
//                   key={`img-${index}-${image.name}`}
//                   className="relative group w-full"
//                 >
//                   <div
//                     className="aspect-square rounded-md shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity touch-manipulation active:opacity-80"
//                     onClick={(e) => openImageModal(image, e)}
//                   >
//                     <img
//                       src={image.preview || "/placeholder.svg"}
//                       alt={image.name || `Uploaded ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={(e) => removeImage(index, e)}
//                     className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-600 group-hover:opacity-100 opacity-70 sm:opacity-0 transition-opacity touch-manipulation"
//                     title="Remove image"
//                   >
//                     <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
//                   </button>
//                   <p
//                     className="text-xs mt-1 text-gray-500 truncate leading-tight"
//                     title={image.name}
//                   >
//                     {image.name}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Mobile-optimized Image Modal */}
//       {selectedImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
//           onClick={(e) => closeImageModal(e)}
//         >
//           <div
//             className="relative bg-white rounded-lg w-full h-full sm:w-auto sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
//               <h3 className="text-sm sm:text-lg font-medium truncate mr-2 flex-1">
//                 {selectedImage.name}
//               </h3>
//               <button
//                 onClick={(e) => closeImageModal(e)}
//                 className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 touch-manipulation flex-shrink-0"
//               >
//                 <X className="h-5 w-5 sm:h-6 sm:w-6" />
//               </button>
//             </div>
//             <div className="p-3 sm:p-4 flex items-center justify-center min-h-0">
//               <img
//                 src={selectedImage.preview}
//                 alt={selectedImage.name}
//                 className="max-w-full max-h-full w-auto h-auto object-contain"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mt-4 sm:mt-6">
//         <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//           Do you want to list product for selling?
//         </label>
//         <div className="relative w-full sm:w-auto sm:max-w-xs">
//           <select
//             className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-md appearance-none text-sm bg-white touch-manipulation"
//             value={formData.listForSelling}
//             onChange={(e) =>
//               handleInputChange("listForSelling", e.target.value)
//             }
//           >
//             <option>Yes</option>
//             <option>No</option>
//           </select>
//           <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MediaUploadComponent;
"use client";
import { useState, useRef, useEffect } from "react";
import { Smartphone, QrCode, Wifi, WifiOff, RefreshCw } from "lucide-react";
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
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [socketEvents, setSocketEvents] = useState([]); // For debugging

  // Enhanced socket connection with better configuration
  useEffect(() => {
    const connectSocket = () => {
      const serverUrl = URL || "http://localhost:5000";
      console.log("Attempting to connect to socket:", serverUrl);

      const newSocket = io(serverUrl, {
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      // Connection event handlers
      newSocket.on("connect", () => {
        setIsConnected(true);
        setConnectionAttempts(0);
        console.log("Socket connected successfully:", newSocket.id);

        // Add to debug events
        setSocketEvents((prev) => [
          ...prev,
          {
            type: "connect",
            timestamp: new Date().toISOString(),
            socketId: newSocket.id,
          },
        ]);

        // Send connection confirmation
        newSocket.emit("client-connected", {
          type: "upload-client",
          timestamp: new Date().toISOString(),
        });
      });

      newSocket.on("disconnect", (reason) => {
        setIsConnected(false);
        console.log("Socket disconnected:", reason);

        setSocketEvents((prev) => [
          ...prev,
          {
            type: "disconnect",
            timestamp: new Date().toISOString(),
            reason,
          },
        ]);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);

        setSocketEvents((prev) => [
          ...prev,
          {
            type: "connect_error",
            timestamp: new Date().toISOString(),
            error: error.message,
          },
        ]);

        // Retry connection after delay
        if (connectionAttempts < 3) {
          setTimeout(() => {
            setConnectionAttempts((prev) => prev + 1);
            connectSocket();
          }, 2000 * (connectionAttempts + 1));
        }
      });

      // Listen for connection confirmation
      newSocket.on("connection-confirmed", (data) => {
        console.log("Connection confirmed:", data);
        setSocketEvents((prev) => [
          ...prev,
          {
            type: "connection-confirmed",
            timestamp: new Date().toISOString(),
            data,
          },
        ]);
      });

      setSocket(newSocket);
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Enhanced mobile upload listener with better error handling
  useEffect(() => {
    if (socket && uploadToken && isConnected) {
      const eventName = `mobile-upload-${uploadToken}`;
      const summaryEventName = `mobile-upload-summary-${uploadToken}`;

      console.log(
        "Setting up listeners for events:",
        eventName,
        summaryEventName
      );

      const handleMobileUpload = (imageData) => {
        console.log("Received mobile upload data:", imageData);

        setSocketEvents((prev) => [
          ...prev,
          {
            type: "mobile-upload",
            timestamp: new Date().toISOString(),
            imageData: {
              id: imageData.id,
              name: imageData.name,
              size: imageData.size,
            },
          },
        ]);

        // Validate image data
        if (!imageData || !imageData.url || !imageData.name) {
          console.error("Invalid image data received:", imageData);
          return;
        }

        // Create new image object for form data
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

        console.log("Adding mobile image to form data:", newImage);

        // Update form data with new image
        setFormData((prevFormData) => {
          const currentImages = prevFormData.uploadedImages || [];
          const updatedImages = [...currentImages, newImage];

          console.log("Updated images array length:", updatedImages.length);

          return {
            ...prevFormData,
            uploadedImages: updatedImages,
          };
        });

        // Update mobile uploads count
        setMobileUploadsCount((prev) => {
          const newCount = prev + 1;
          console.log("Mobile uploads count:", newCount);
          return newCount;
        });
      };

      const handleUploadSummary = (summaryData) => {
        console.log("Received upload summary:", summaryData);
        setSocketEvents((prev) => [
          ...prev,
          {
            type: "upload-summary",
            timestamp: new Date().toISOString(),
            summaryData,
          },
        ]);
      };

      // Register event listeners
      socket.on(eventName, handleMobileUpload);
      socket.on(summaryEventName, handleUploadSummary);

      // Register upload token with socket
      if (uploadToken) {
        socket.emit("register-upload-token", {
          token: uploadToken,
          userId: localStorage.getItem("userId") || "anonymous",
        });
      }

      return () => {
        console.log(
          "Cleaning up listeners for events:",
          eventName,
          summaryEventName
        );
        socket.off(eventName, handleMobileUpload);
        socket.off(summaryEventName, handleUploadSummary);

        if (uploadToken) {
          socket.emit("cleanup-upload-token", { token: uploadToken });
        }
      };
    }
  }, [socket, uploadToken, isConnected, setFormData]);

  // Timer for QR code expiry
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
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [qrCodeExpiry, showQRCode]);

  // Generate QR code for mobile upload
  const handleGenerateQRCode = async () => {
    try {
      if (!isConnected) {
        alert(
          "Socket connection not established. Please try again in a moment."
        );
        return;
      }

      const token = generateUploadToken();
      const qrCode = await generateQRCode(token);

      if (qrCode) {
        setUploadToken(token);
        setQRCodeData(qrCode);
        setShowQRCode(true);
        setMobileUploadsCount(0);

        // Set expiry to 10 minutes from now
        const expiry = new Date().getTime() + 10 * 60 * 1000;
        setQRCodeExpiry(expiry);
        setTimeRemaining(10 * 60 * 1000);

        // Register the token with the backend
        const serverUrl = URL || "http://localhost:5000";
        const response = await fetch(
          `${serverUrl}/api/products/register-upload-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              expiresAt: new Date(expiry).toISOString(),
            }),
          }
        );

        const result = await response.json();
        if (result.success) {
          console.log(`QR code generated and registered with token: ${token}`);
        } else {
          console.error("Failed to register token:", result.message);
        }
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    }
  };

  // Close QR code modal
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

  // Format time remaining
  const formatTimeRemaining = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Rest of your existing component code...
  // (handleFileUpload, removeImage, handleDrop, etc.)

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-3 sm:p-4 md:p-6 w-full max-w-full overflow-hidden">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
        Media upload
      </h2>

      {/* Debug Panel (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          <details>
            <summary className="cursor-pointer font-medium">Debug Info</summary>
            <div className="mt-2 space-y-1">
              <p>Socket Connected: {isConnected ? "✅" : "❌"}</p>
              <p>Socket ID: {socket?.id || "N/A"}</p>
              <p>Upload Token: {uploadToken || "N/A"}</p>
              <p>Mobile Uploads: {mobileUploadsCount}</p>
              <p>Total Images: {formData.uploadedImages?.length || 0}</p>
              <div className="max-h-20 overflow-y-auto">
                <p className="font-medium">Recent Events:</p>
                {socketEvents.slice(-5).map((event, idx) => (
                  <p key={idx} className="text-xs">
                    {event.timestamp.split("T")[1].split(".")[0]} - {event.type}
                  </p>
                ))}
              </div>
            </div>
          </details>
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
            {/* Connection Status */}
            <div className="flex items-center">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" title="Connected" />
              ) : (
                <div className="flex items-center">
                  <WifiOff
                    className="h-4 w-4 text-red-500"
                    title="Disconnected"
                  />
                  <button
                    onClick={() => window.location.reload()}
                    className="ml-1 p-1 hover:bg-gray-200 rounded"
                    title="Retry connection"
                  >
                    <RefreshCw className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              )}
            </div>
            {!showQRCode && (
              <button
                type="button"
                onClick={handleGenerateQRCode}
                disabled={!isConnected}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <QrCode className="h-4 w-4 mr-1" />
                Show QR Code
              </button>
            )}
          </div>
        </div>

        {!isConnected && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            ⚠️ Connection issue detected. Mobile uploads may not work properly.
          </div>
        )}

        {/* Rest of your QR code display logic */}
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

      {/* Rest of your component JSX */}
    </div>
  );
};

export default MediaUploadComponent;
