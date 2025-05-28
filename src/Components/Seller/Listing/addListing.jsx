"use client";

import { useState } from "react";
import {
  X,
  Upload,
  Package,
  Tag,
  Building2,
  FileText,
  Hash,
  Camera,
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

export default function AddListing({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    Product_Name: "",
    Category: "",
    Manufacturer: "",
    Description: "",
    Stock: "0",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const userId = localStorage.getItem("userId");
  // Categories - you can customize these based on your needs
  const categories = [
    "Core Drill Bits",
    "Core Drills",
    "Flat Saws",
    "Wall Saws & Wire Saws",
    "Diamond Consumables",
    "Handheld Power Saws",
    "Specialty Saws",
    "Drilling Equipment",
    "Joint Sealant & Repair Equipment",
    "Materials & Consumables",
    "Demolition Equipment",
    "Accessories",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const filesArray = Array.from(files);

    // Validate file types
    const validFiles = filesArray.filter((file) => {
      const isValid = file.type.startsWith("image/");
      if (!isValid) {
        alert(`${file.name} is not a valid image file`);
      }
      return isValid;
    });

    // Limit to 10 images total
    const remainingSlots = 10 - images.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length < validFiles.length) {
      alert("Maximum 10 images allowed");
    }

    // Create previews
    const newPreviews = [];
    let loadedCount = 0;

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        loadedCount++;
        if (loadedCount === filesToAdd.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages((prev) => [...prev, ...filesToAdd]);
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.Product_Name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.Category) {
      toast.error("Category is required");
      return;
    }
    if (formData.Stock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();

      // Add form fields
      submitData.append("Product_Name", formData.Product_Name);
      submitData.append("Category", formData.Category);
      submitData.append("Manufacturer", formData.Manufacturer);
      submitData.append("Description", formData.Description);
      submitData.append("Stock", formData.Stock);

      // Add image files
      images.forEach((file) => {
        submitData.append("files", file);
      });

      const response = await fetch(`${URL}/api/listing/add/${userId}`, {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Listing created successfully!");

        // Reset form
        setFormData({
          Product_Name: "",
          Category: "",
          Manufacturer: "",
          Description: "",
          Stock: 1,
        });
        setImages([]);
        setImagePreviews([]);

        onSuccess?.();
      } else {
        toast.error(data.message || "Failed to create listing");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("An error occurred while creating the listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <CubeLoader />}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />
      <div className="min-h-screen my-10 bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-[#e06449]" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Product
              </h1>
            </div>
            <div className="text-sm text-gray-500 my-3">
              <Link
                to="/listing"
                className=" hover:text-orange-500 transition-all ease-in-out  hover:ease-in-out duration-300"
              >
                <span>Product listing /</span>{" "}
              </Link>
              <span className="text-orange-500">Add Listing</span>
            </div>
            <p className="text-gray-600">
              Create a new product listing with detailed information and images
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Main Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r to-[#e06449] from-[#F47458] px-8 py-6">
                <h2 className="text-xl font-semibold text-white">
                  Product Information
                </h2>
                <p className="text-blue-100 mt-1">
                  Fill in the basic details about your product
                </p>
              </div>

              <div className="p-8 space-y-6">
                {/* Product Name & Category Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Tag className="h-4 w-4" />
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.Product_Name}
                      onChange={(e) =>
                        handleInputChange("Product_Name", e.target.value)
                      }
                      placeholder="Enter product name"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <FileText className="h-4 w-4" />
                      Category *
                    </label>
                    <select
                      value={formData.Category}
                      onChange={(e) =>
                        handleInputChange("Category", e.target.value)
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Manufacturer & Stock Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Building2 className="h-4 w-4" />
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={formData.Manufacturer}
                      onChange={(e) =>
                        handleInputChange("Manufacturer", e.target.value)
                      }
                      placeholder="Enter manufacturer name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  {/* <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Hash className="h-4 w-4" />
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      value={formData.Stock}
                      onChange={(e) =>
                        handleInputChange(
                          "Stock",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Enter stock quantity"
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div> */}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <FileText className="h-4 w-4" />
                    Description
                  </label>
                  <textarea
                    value={formData.Description}
                    onChange={(e) =>
                      handleInputChange("Description", e.target.value)
                    }
                    placeholder="Enter detailed product description..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Images Upload Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r to-[#e06449] from-[#F47458] px-8 py-6">
                <div className="flex items-center gap-3">
                  <Camera className="h-6 w-6 text-white" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Product Images
                    </h2>
                    <p className="text-purple-100 mt-1">
                      Upload up to 10 high-quality images
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-[#e06449]" />
                    </div>
                    <div>
                      <label htmlFor="images" className="cursor-pointer">
                        <span className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                          Click to upload images
                        </span>
                        <p className="text-gray-500 mt-1">
                          or drag and drop your files here
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          PNG, JPG, JPEG up to 5MB each (max 10 images)
                        </p>
                      </label>
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Uploaded Images ({imagePreviews.length}/10)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                            <img
                              src={
                                preview || "/placeholder.svg?height=96&width=96"
                              }
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0  group-hover:bg-opacity-20 transition-all duration-200" />
                          </div>
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r to-[#e06449] from-[#F47458] text-white font-semibold rounded-xl cursor-pointer hover:bg-[#F47458] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Listing...
                  </div>
                ) : (
                  "Create Product Listing"
                )}
              </button>
              <Link
                type="button"
                to="/listing"
                className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
