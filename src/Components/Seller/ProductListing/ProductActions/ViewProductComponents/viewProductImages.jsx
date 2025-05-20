import { useState } from "react";
import { ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

const MediaViewComponent = ({ formData = { images: [] } }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openImageModal = (image, index, e) => {
    if (e) e.stopPropagation();
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeImageModal = (e) => {
    if (e) e.stopPropagation();
    setSelectedImage(null);
  };

  const navigateImage = (direction, e) => {
    if (e) e.stopPropagation();

    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < formData.images.length) {
      setCurrentIndex(newIndex);
      setSelectedImage(formData.images[newIndex]);
    }
  };

  // Handle keyboard navigation in the modal
  const handleKeyDown = (e) => {
    if (!selectedImage) return;

    if (e.key === "ArrowLeft") {
      navigateImage(-1, e);
    } else if (e.key === "ArrowRight") {
      navigateImage(1, e);
    } else if (e.key === "Escape") {
      closeImageModal(e);
    }
  };

  // Add event listener for keyboard navigation
  useState(() => {
    if (selectedImage) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImage, currentIndex]);

  return (
    <div className="bg-white border mb-50 border-gray-100 rounded-lg p-6 w-full max-w-full overflow-hidden">
      <h2 className="text-lg font-semibold mb-4 text-[#F47458]">
        Product Images
      </h2>

      {formData.images && formData.images.length > 0 ? (
        <div className="w-full overflow-hidden">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <ImageIcon className="h-4 w-4 mr-2 " />
            Total Images ({formData.images.length})
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
            {formData.images.map((image, index) => (
              <div
                key={`img-${index}-${image.name}`}
                className="relative group w-full"
              >
                <div
                  className="h-40 rounded-md shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={(e) => openImageModal(image, index, e)}
                >
                  <img
                    src={image.preview || "/api/placeholder/400/320"}
                    alt={image.name || `Product Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="text-xs mt-1 text-gray-500 truncate"
                  title={image.name}
                >
                  {image.name || `Image ${index + 1}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon className="h-16 w-16 text-gray-300 mb-3" />
          <p className="text-gray-500">No images available for this product</p>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div
            className="relative bg-white rounded-lg max-w-5xl w-full max-h-screen overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium truncate">
                {selectedImage.name || `Product Image ${currentIndex + 1}`}
              </h3>
              <button
                onClick={closeImageModal}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="relative p-4 flex items-center justify-center bg-gray-100">
              <img
                src={selectedImage.preview || "/api/placeholder/800/600"}
                alt={selectedImage.name || `Product Image ${currentIndex + 1}`}
                className="max-h-[70vh] max-w-full object-contain"
              />

              {/* Navigation buttons */}
              {currentIndex > 0 && (
                <button
                  onClick={(e) => navigateImage(-1, e)}
                  className="absolute left-4 bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {currentIndex < formData.images.length - 1 && (
                <button
                  onClick={(e) => navigateImage(1, e)}
                  className="absolute right-4 bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Image {currentIndex + 1} of {formData.images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaViewComponent;
