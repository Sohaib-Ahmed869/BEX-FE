"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  User,
  Calendar,
  Mail,
  Building,
  MoreVertical,
  Search,
  Filter,
  X,
  Check,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const URL = import.meta.env.VITE_REACT_BACKEND_URL;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    role: "",
    is_active: "",
    email_verified: "",
    seller_approval_status: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  // Search debouncing states
  const [searchInput, setSearchInput] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Modal states
  const [showActionModal, setShowActionModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      });

      const response = await fetch(`${URL}/api/user?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users || []);
        setTotalItems(data.data.pagination.totalUsers);
        setTotalPages(data.data.pagination.totalPages);
        setHasNextPage(data.data.pagination.hasNextPage);
        setHasPreviousPage(data.data.pagination.hasPreviousPage);
      } else {
        setError("Failed to fetch users");
        console.error("Failed to fetch users");
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, filters]);

  // Handle search input with debouncing
  const handleSearchInputChange = (value) => {
    setSearchInput(value);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value }));
      setCurrentPage(1); // Reset to first page when searching
    }, 1000); // 1 second delay

    setSearchTimeout(timeout);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Handle filter changes (for non-search filters)
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear all filters
  const clearFilters = () => {
    // Clear search timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchInput(""); // Clear search input
    setFilters({
      role: "",
      is_active: "",
      email_verified: "",
      seller_approval_status: "",
      search: "",
    });
    setCurrentPage(1);
  };

  // Handle user status toggle (updated to use the new suspend endpoint)
  const handleToggleUserStatus = async (userId, currentIsSuspended) => {
    setModalLoading(true);
    try {
      const response = await fetch(`${URL}/api/user/${userId}/suspend`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suspend: !currentIsSuspended,
          reason: suspendReason || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the user status in state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  is_suspended: !currentIsSuspended,
                  is_active: currentIsSuspended, // When unsuspending, user becomes active; when suspending, user becomes inactive
                }
              : user
          )
        );
        toast.success(
          `User ${
            !currentIsSuspended ? "suspended" : "unsuspended"
          } successfully`
        );
      } else {
        toast.error(data.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Error updating user status");
    } finally {
      setModalLoading(false);
      setShowActionModal(false);
      setSelectedUser(null);
      setSuspendReason("");
    }
  };

  // Handle dropdown actions
  const handleDropdownAction = (action, user) => {
    setOpenDropdown(null);

    if (action === "suspend" || action === "unsuspend") {
      setSelectedUser(user);
      setShowActionModal(true);
    } else if (action === "verify") {
      setSelectedUser(user);
      setShowVerificationModal(true);
    } else if (action === "insights") {
      navigate(`/admin/users/insights/${user.id}`);
    }
  };

  // Get user status styling (updated to check is_suspended)
  const getUserStatus = (user) => {
    if (user.is_suspended) {
      return { text: "Suspended", className: "bg-red-100 text-red-600" };
    } else if (user.is_active) {
      return { text: "Active", className: "bg-green-100 text-green-600" };
    } else {
      return { text: "Inactive", className: "bg-gray-100 text-gray-600" };
    }
  };

  // Get role styling
  const getRoleStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return { text: "Admin", className: "bg-purple-100 text-purple-600" };
      case "seller":
        return { text: "Seller", className: "bg-blue-100 text-blue-600" };
      case "buyer":
        return { text: "Buyer", className: "bg-gray-100 text-gray-600" };
      default:
        return {
          text: role || "Unknown",
          className: "bg-gray-100 text-gray-600",
        };
    }
  };

  // Get access level
  const getAccessLevel = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "Admin";
      case "seller":
        return "Editor/manager";
      case "buyer":
        return "Read only";
      default:
        return "Unknown";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Pagination controls
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // Action Dropdown Component
  const ActionDropdown = ({ user, isOpen, onToggle }) => {
    const isSuspended = user.is_suspended;
    const canVerify =
      !user.email_verified || (user.role === "seller" && !user.seller_verified);

    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className="p-2 border border-gray-200 rounded hover:bg-gray-100 flex items-center gap-1"
          title="Actions"
        >
          <MoreVertical className="h-4 w-4" />
          {/* <ChevronDown className="h-3 w-3" /> */}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-1">
              <Link
                to={`/admin/users/insights/${user.id}`}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                User Insights
              </Link>
              {canVerify && (
                <button
                  onClick={() => handleDropdownAction("verify", user)}
                  className="w-full cursor-pointer text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Verify User
                </button>
              )}
              <button
                onClick={() =>
                  handleDropdownAction(
                    isSuspended ? "unsuspend" : "suspend",
                    user
                  )
                }
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                  isSuspended ? "text-green-600" : "text-red-600"
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                {isSuspended ? "Unsuspend User" : "Suspend User"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  const VerificationModal = ({ isOpen, user, onClose, onConfirm }) => {
    const [verificationType, setVerificationType] = useState("email");
    const [modalLoading, setModalLoading] = useState(false);

    if (!isOpen || !user) return null;

    const handleVerification = async () => {
      setModalLoading(true);
      try {
        const response = await fetch(`${URL}/api/user/verify/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationType: verificationType,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Update the user verification status in state
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id === user.id
                ? {
                    ...u,
                    ...(verificationType === "email"
                      ? { email_verified: true }
                      : {
                          seller_verified: true,
                          seller_approval_status: "approved",
                        }),
                  }
                : u
            )
          );

          toast.success(
            `User ${verificationType} verification completed successfully`
          );
          onClose();
        } else {
          toast.error(data.message || "Failed to verify user");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        toast.error("Error verifying user");
      } finally {
        setModalLoading(false);
      }
    };

    const canVerifyEmail = !user.email_verified;
    const canVerifySeller = user.role === "seller" && !user.seller_verified;
    const hasVerificationOptions = canVerifyEmail || canVerifySeller;

    // If no verification options available
    if (!hasVerificationOptions) {
      return (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <Check className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-green-500 flex-shrink-0" />
                <h3 className="text-lg font-semibold">User Already Verified</h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 text-sm sm:text-base">
                  This user has already been verified for all applicable
                  verification types.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Email: {user.email_verified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  {user.role === "seller" && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        Seller:{" "}
                        {user.seller_verified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <Check className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-green-500 flex-shrink-0" />
              <h3 className="text-lg font-semibold">Verify User</h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                Select the type of verification to apply to this user:
              </p>

              {/* Verification Type Selection */}
              <div className="space-y-3">
                {canVerifyEmail && (
                  <label className="flex items-start sm:items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="verificationType"
                      value="email"
                      checked={verificationType === "email"}
                      onChange={(e) => setVerificationType(e.target.value)}
                      className="text-blue-600 mt-1 sm:mt-0 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        Email Verification
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 break-words">
                        Mark the user's email address as verified
                      </div>
                    </div>
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                  </label>
                )}

                {canVerifySeller && (
                  <label className="flex items-start sm:items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="verificationType"
                      value="seller"
                      checked={verificationType === "seller"}
                      onChange={(e) => setVerificationType(e.target.value)}
                      className="text-blue-600 mt-1 sm:mt-0 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        Seller Verification
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 break-words">
                        Approve the seller's account and business details
                      </div>
                    </div>
                    <Building className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                  </label>
                )}
              </div>

              {/* Verification Details */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">
                  {verificationType === "email"
                    ? "Email Verification"
                    : "Seller Verification"}{" "}
                  Details:
                </h4>
                <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                  {verificationType === "email" ? (
                    <>
                      <li>• User's email will be marked as verified</li>
                      <li>
                        • User will gain access to email-verified features
                      </li>
                      <li>• This action cannot be undone easily</li>
                    </>
                  ) : (
                    <>
                      <li>• Seller account will be approved and verified</li>
                      <li>• Seller Products will be marked as verified</li>
                      <li>
                        • Seller approval status will be set to "approved"
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={onClose}
                disabled={modalLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors order-2 sm:order-1 md:w-1/2"
              >
                Cancel
              </button>
              <button
                onClick={handleVerification}
                disabled={modalLoading}
                className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 transition-colors order-1 sm:order-2 md:w-1/2"
              >
                {modalLoading
                  ? "Processing..."
                  : `Verify ${
                      verificationType === "email" ? "Email" : "Seller"
                    }`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Action Modal Component (updated)
  const ActionModal = ({ isOpen, user, onClose, onConfirm }) => {
    if (!isOpen || !user) return null;

    const isSuspended = user.is_suspended;
    const action = isSuspended ? "unsuspend" : "suspend";
    const actionText = isSuspended ? "Unsuspend" : "Suspend";

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6  w-1/3 mx-4">
          <div className="flex items-center mb-4">
            <AlertCircle
              className={`h-6 w-6 mr-3 ${
                isSuspended ? "text-green-500" : "text-red-500"
              }`}
            />
            <h3 className="text-lg font-semibold">{actionText} user</h3>
          </div>

          {!isSuspended ? (
            // Suspend user content
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                You're about to suspend this user from accessing the platform.
                While suspended, the user will:
              </p>
              <ul className="text-gray-700 mb-4 ml-4">
                <li className="mb-1">
                  • Be unable to log in or perform any actions
                </li>
                <li className="mb-1">
                  • Lose access to all company modules and data
                </li>
              </ul>
              <p className="text-gray-700">
                This action does not delete the account, and access can be
                restored later by reactivating the user.
              </p>
            </div>
          ) : (
            // Unsuspend user content
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                You're about to unsuspend this user and restore their access to
                the platform. Once unsuspended, the user will:
              </p>
              <ul className="text-gray-700 mb-4 ml-4">
                <li className="mb-1">
                  • Be able to log in and perform actions
                </li>
                <li className="mb-1">
                  • Regain access to all company modules and data
                </li>
              </ul>
              <p className="text-gray-700">
                The user will be immediately able to access their account and
                resume normal activities.
              </p>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              disabled={modalLoading}
              className="px-4 py-2 border w-1/2 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(user.id, user.is_suspended)}
              disabled={modalLoading}
              className={`px-4 py-2 w-1/2 rounded-md text-white disabled:opacity-50 ${
                isSuspended
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {modalLoading ? "Processing..." : `${actionText} user`}
            </button>
          </div>
        </div>
      </div>
    );
  };
  // Close dropdown when clicking outside
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

  if (loading) {
    return <CubeLoader />;
  }

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-10 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />

      <div className="mt-10">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-regular mb-4">
          User Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-5 w-5" />
              <span className="text-sm">Total Users: {totalItems}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchInput}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    className="pl-10 w-full border border-gray-200 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                  <option value="buyer">Buyer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.is_active}
                  onChange={(e) =>
                    handleFilterChange("is_active", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Verified
                </label>
                <select
                  value={filters.email_verified}
                  onChange={(e) =>
                    handleFilterChange("email_verified", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seller Status
                </label>
                <select
                  value={filters.seller_approval_status}
                  onChange={(e) =>
                    handleFilterChange("seller_approval_status", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 my-10">
            {users.length === 0 ? (
              <div className="text-center py-10">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No users found</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-white border-b border-gray-100">
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          #
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          User name
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Email
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          User created on
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Company name
                        </th>
                        <th className="py-3 px-4 text-center font-medium text-sm text-gray-500">
                          Role assigned
                        </th>
                        <th className="py-3 px-4 text-center font-medium text-sm text-gray-500">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => {
                        const userStatus = getUserStatus(user);
                        const roleStyle = getRoleStyle(user.role);

                        return (
                          <tr
                            key={user.id}
                            className={`border-b border-gray-100 ${
                              index % 2 !== 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-gray-100 transition-colors duration-200`}
                          >
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              {index + 1 + (currentPage - 1) * itemsPerPage}
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div className="font-regular text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div className="flex items-center gap-1">
                                <span>{user.email}</span>
                                {user.email_verified && (
                                  <Check className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div className="text-sm">
                                {formatDate(user.created_at)}
                              </div>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div className="font-regular text-gray-900">
                                {user.company_name || "N/A"}
                              </div>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <span
                                className={`px-4 text-center block py-2 rounded text-sm font-medium ${roleStyle.className}`}
                              >
                                {roleStyle.text}
                              </span>
                            </td>
                            <td className="py-3 px-4  border-r border-gray-100 text-gray-600">
                              <span
                                className={`px-4   text-center py-2 block  rounded text-sm font-medium ${userStatus.className}`}
                              >
                                {userStatus.text}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {user.role !== "admin" && (
                                <div className="flex justify-center">
                                  <ActionDropdown
                                    user={user}
                                    isOpen={openDropdown === user.id}
                                    onToggle={() =>
                                      setOpenDropdown(
                                        openDropdown === user.id
                                          ? null
                                          : user.id
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {users.map((user, index) => {
                    const userStatus = getUserStatus(user);
                    const roleStyle = getRoleStyle(user.role);

                    return (
                      <div
                        key={user.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                              {user.email_verified && (
                                <Check className="h-3 w-3 text-green-500" />
                              )}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${userStatus.className}`}
                            >
                              {userStatus.text}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${roleStyle.className}`}
                            >
                              {roleStyle.text}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-gray-500 flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              Company:
                            </span>
                            <p className="text-gray-900">
                              {user.company_name || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Access Level:</span>
                            <p className="text-gray-900 text-xs">
                              {getAccessLevel(user.role)}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Created:
                            </span>
                            <p className="text-gray-900 text-xs">
                              {formatDate(user.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <ActionDropdown
                            user={user}
                            isOpen={openDropdown === user.id}
                            onToggle={() =>
                              setOpenDropdown(
                                openDropdown === user.id ? null : user.id
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-200 rounded px-2 py-1 text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-500">per page</span>
                  </div>

                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                    {totalItems} results
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50"
                      disabled={!hasPreviousPage}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {getPaginationNumbers().map((page, index) =>
                        page === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-sm"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={`page-${page}`}
                            className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                              currentPage === page
                                ? "bg-[#f47458] text-white"
                                : "border border-gray-200 hover:bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50"
                      disabled={!hasNextPage}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={showActionModal}
        user={selectedUser}
        onClose={() => {
          setShowActionModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleToggleUserStatus}
      />
      <VerificationModal
        isOpen={showVerificationModal}
        user={selectedUser}
        onClose={() => {
          setShowVerificationModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleToggleUserStatus}
      />
    </div>
  );
}
