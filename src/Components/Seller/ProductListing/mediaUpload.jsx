import React, { useState, useRef, useEffect } from "react";
import { Upload, X, ChevronDown, ImageIcon, XCircle } from "lucide-react";

const MediaUploadComponent = ({ formData, setFormData }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Completely revised file upload handler to fix the double-open issue
  const handleFileUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent processing if already handling files
    if (isProcessingFile) {
      return;
    }

    setIsProcessingFile(true);

    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      const newImages = files.map((file) => {
        const previewUrl = URL.createObjectURL(file);

        return {
          file: file,
          preview: previewUrl,
          name: file.name,
        };
      });

      // Update form data with new images
      setFormData((prevFormData) => ({
        ...prevFormData,
        uploadedImages: [...(prevFormData.uploadedImages || []), ...newImages],
      }));

      // Clear the file input value to ensure it triggers even if same file is selected again
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          setIsProcessingFile(false);
        }
      }, 300);
    } else {
      setIsProcessingFile(false);
    }
  };

  // Remove uploaded image
  const removeImage = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const updatedImages = [...formData.uploadedImages];

    // Revoke the object URL to prevent memory leaks
    if (updatedImages[index]?.preview) {
      URL.revokeObjectURL(updatedImages[index].preview);
    }

    updatedImages.splice(index, 1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      uploadedImages: updatedImages,
    }));
  };

  // Updated drag and drop handler
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessingFile) {
      return;
    }

    setIsProcessingFile(true);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);

      // Create file previews and store file objects for backend upload
      const newImages = files.map((file) => {
        // Create a preview URL for display
        const previewUrl = URL.createObjectURL(file);

        // Return an object with both the file and preview URL
        return {
          file: file, // Original file for S3 upload
          preview: previewUrl, // URL for preview
          name: file.name, // Filename for display
        };
      });

      // Update form data with new images
      setFormData((prevFormData) => ({
        ...prevFormData,
        uploadedImages: [...(prevFormData.uploadedImages || []), ...newImages],
      }));
    }

    setTimeout(() => {
      setIsProcessingFile(false);
    }, 300);
  };

  // Function to open image modal
  const openImageModal = (image, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedImage(image);
  };

  // Function to close image modal
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

  // Separate click handler for the browse button
  const handleBrowseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessingFile) {
      return;
    }

    // Directly handle the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Prevent the drop zone from triggering the file input
  const handleDropZoneClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessingFile) {
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 w-full max-w-full overflow-hidden">
      <h2 className="text-lg font-semibold mb-4">Media upload</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          Upload your media
          <div className="ml-2 bg-orange-100 text-orange-500 rounded-full p-0.5">
            <Upload className="h-4 w-4" />
          </div>
        </label>

        <div
          className="border-2 border-dashed border-gray-300 rounded-md p-6 mb-4 cursor-pointer"
          onClick={handleDropZoneClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-orange-500 mb-2" />
            <p className="text-center mb-2">
              Select your file or drag and drop
            </p>
            <p className="text-xs text-gray-500 mb-4">
              png, jpg, jpeg accepted
            </p>
            <button
              type="button"
              className="bg-orange-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-orange-600"
              onClick={handleBrowseClick}
              disabled={isProcessingFile}
            >
              Browse
            </button>
            {/* Hidden file input - completely separate from the browse button */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {/* Enhanced Image gallery with fixed width constraints */}
        {formData.uploadedImages && formData.uploadedImages.length > 0 && (
          <div className="mt-4 w-full overflow-x-hidden">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" /> Uploaded Images (
              {formData.uploadedImages.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
              {formData.uploadedImages.map((image, index) => (
                <div
                  key={`img-${index}-${image.name}`}
                  className="relative   group w-full "
                >
                  <div
                    className="h-40 rounded-md shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={(e) => openImageModal(image, e)}
                  >
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt={image.name || `Uploaded ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => removeImage(index, e)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-600 group-hover:opacity-100 opacity-0 transition-opacity"
                    title="Remove image"
                  >
                    <XCircle className="h-5 w-5" />
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
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={(e) => closeImageModal(e)}
        >
          <div
            className="relative bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-medium">{selectedImage.name}</h3>
              <button
                onClick={(e) => closeImageModal(e)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.preview}
                alt={selectedImage.name}
                className="max-h-full w-auto mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you want to list product for selling?
        </label>
        <div className="relative w-full max-w-xs">
          <select
            className="w-full p-2 border border-gray-300 rounded-md appearance-none"
            value={formData.listForSelling}
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
