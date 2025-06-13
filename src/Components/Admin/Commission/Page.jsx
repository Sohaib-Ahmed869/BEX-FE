import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash,
  MoreVertical,
  X,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import CubeLoader from "../../../utils/cubeLoader";

// Mock URL for demo purposes
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

// Add Commission Modal Component
const AddCommissionModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
}) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Commission
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f47458] focus:border-[#f47458]"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.commission_rate}
                onChange={(e) =>
                  setFormData({ ...formData, commission_rate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f47458] focus:border-[#f47458]"
                placeholder="Enter commission rate (e.g., 5.50)"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="flex-1 px-4 py-2 bg-[#f47458] text-white rounded-md hover:bg-[#ee4c2d] disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Commission"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update Commission Modal Component
const UpdateCommissionModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
  selectedCommission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Update Commission
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={selectedCommission?.category || ""}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.commission_rate}
                onChange={(e) =>
                  setFormData({ ...formData, commission_rate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f47458] focus:border-[#f47458]"
                placeholder="Enter commission rate (e.g., 5.50)"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="flex-1 px-4 py-2 bg-[#f47458] text-white rounded-md hover:bg-[#ee4c2d] disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Commission"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  selectedCommission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Delete Commission
            </h2>
            <p className="text-sm text-gray-500">
              This action cannot be undone
            </p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete the commission for{" "}
          <span className="font-medium">{selectedCommission?.category}</span>?
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Commission Management Component
function CommissionManagement() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form data
  const [addFormData, setAddFormData] = useState({
    category: "",
    commission_rate: "",
  });
  const [updateFormData, setUpdateFormData] = useState({
    commission_rate: "",
  });
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Fetch commissions from API (mocked for demo)
  const fetchCommissions = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await axios.get(`${URL}/api/admin/commission`);
      const data = await response.data;
      console.log(data);
      setCommissions(data.data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.message || "An error occurred";
      setError(errorMessage);
      console.error(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  // Handle dropdown actions
  const handleDropdownAction = (action, commission) => {
    setSelectedCommission(commission);
    setOpenDropdown(null);

    if (action === "update") {
      setUpdateFormData({
        commission_rate: commission.commission_rate,
      });
      setShowUpdateModal(true);
    } else if (action === "delete") {
      setShowDeleteModal(true);
    }
  };

  // Handle add commission
  const handleAddSubmit = async () => {
    if (!addFormData.category || !addFormData.commission_rate) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${URL}/api/admin/commission`, {
        category: addFormData.category,
        commission_rate: parseFloat(addFormData.commission_rate),
      });

      if (response.data.success) {
        // Add the new commission from the API response
        setCommissions([...commissions, response.data.data]);
        setShowAddModal(false);
        setAddFormData({ category: "", commission_rate: "" });
        toast.success(response.data.message || "Commission added successfully");
      } else {
        toast.error(response.data.message || "Error adding commission");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error adding commission";
      toast.error(errorMessage);
      console.error("Error adding commission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!selectedCommission || !updateFormData.commission_rate) {
      toast.error("Please enter a valid commission rate");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `${URL}/api/admin/commission/${encodeURIComponent(
          selectedCommission.category
        )}`,
        {
          commission_rate: parseFloat(updateFormData.commission_rate),
        }
      );

      if (response.data.success) {
        // Update the commission in the state with the response data
        const updatedCommissions = commissions.map((commission) =>
          commission.category === selectedCommission.category
            ? response.data.data
            : commission
        );
        setCommissions(updatedCommissions);
        setShowUpdateModal(false);
        setSelectedCommission(null);
        setUpdateFormData({ commission_rate: "" });
        toast.success(
          response.data.message || "Commission updated successfully"
        );
      } else {
        toast.error(response.data.message || "Error updating commission");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error updating commission";
      toast.error(errorMessage);
      console.error("Error updating commission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCommission) return;

    setIsSubmitting(true);
    try {
      const response = await axios.delete(
        `${URL}/api/admin/commission/${encodeURIComponent(
          selectedCommission.category
        )}`
      );

      if (response.data.success) {
        // Remove the commission from state
        const filteredCommissions = commissions.filter(
          (commission) => commission.category !== selectedCommission.category
        );
        setCommissions(filteredCommissions);
        setShowDeleteModal(false);
        setSelectedCommission(null);
        toast.success(
          response.data.message || "Commission deleted successfully"
        );
      } else {
        toast.error(response.data.message || "Error deleting commission");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error deleting commission";
      toast.error(errorMessage);
      console.error("Error deleting commission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Close modals
  const closeAddModal = () => {
    setShowAddModal(false);
    setAddFormData({ category: "", commission_rate: "" });
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedCommission(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCommission(null);
  };

  // Action Dropdown Component
  const ActionDropdown = ({ commission, isOpen, onToggle }) => {
    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className="p-2 border border-gray-200 rounded hover:bg-gray-100 flex items-center gap-1"
          title="Actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 bottom-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-60">
            <div className="py-1">
              <button
                onClick={() => handleDropdownAction("update", commission)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Update Commission
              </button>
              <button
                onClick={() => handleDropdownAction("delete", commission)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
              >
                <Trash className="h-4 w-4" />
                Delete Commission
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <CubeLoader />;
  }

  if (error) {
    return (
      <div className="bg-gray-100 p-4 sm:p-6 lg:p-10 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-red-500">
            <p>Error: {error}</p>
            <button
              onClick={fetchCommissions}
              className="mt-4 px-4 py-2 bg-[#f47458] text-white rounded hover:bg-[#eb6c4d] transition duration-300 ease-in-out"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-10 min-h-screen">
      <div className="mt-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-regular">
            Commission Management
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#f47458] text-white px-4 py-2 rounded-md hover:bg-[#eb6c4d] flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Commission
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 my-10">
            {commissions.length === 0 ? (
              <div className="text-center py-10">
                <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No commissions found</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#f47458] text-white px-4 py-2 rounded-md hover:bg-[#eb6c4d] flex items-center gap-2 mx-auto"
                >
                  Add First Commission
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block ">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-white border-b border-gray-100">
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          #
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Category
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Commission Rate
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Created Date
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Last Updated
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.map((commission, index) => (
                        <tr
                          key={commission.id}
                          className={`border-b border-gray-100 ${
                            index % 2 !== 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition-colors duration-200`}
                        >
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {index + 1}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div className="font-medium text-gray-900">
                              {commission.category}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                              {commission.commission_rate}%
                            </span>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {new Date(
                              commission.created_at
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {new Date(
                              commission.updated_at
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center">
                              <ActionDropdown
                                commission={commission}
                                isOpen={openDropdown === commission.id}
                                onToggle={() =>
                                  setOpenDropdown(
                                    openDropdown === commission.id
                                      ? null
                                      : commission.id
                                  )
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {commissions.map((commission, index) => (
                    <div
                      key={commission.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {commission.category}
                          </h3>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium mt-1 inline-block">
                            {commission.commission_rate}%
                          </span>
                        </div>
                        <ActionDropdown
                          commission={commission}
                          isOpen={openDropdown === commission.id}
                          onToggle={() =>
                            setOpenDropdown(
                              openDropdown === commission.id
                                ? null
                                : commission.id
                            )
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <p className="text-gray-900">
                            {new Date(
                              commission.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Updated:</span>
                          <p className="text-gray-900">
                            {new Date(
                              commission.updated_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Commission Modal */}
      <AddCommissionModal
        isOpen={showAddModal}
        onClose={closeAddModal}
        onSubmit={handleAddSubmit}
        formData={addFormData}
        setFormData={setAddFormData}
        isSubmitting={isSubmitting}
      />

      {/* Update Commission Modal */}
      <UpdateCommissionModal
        isOpen={showUpdateModal}
        onClose={closeUpdateModal}
        onSubmit={handleUpdateSubmit}
        formData={updateFormData}
        setFormData={setUpdateFormData}
        isSubmitting={isSubmitting}
        selectedCommission={selectedCommission}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
        selectedCommission={selectedCommission}
      />
    </div>
  );
}

export default CommissionManagement;
