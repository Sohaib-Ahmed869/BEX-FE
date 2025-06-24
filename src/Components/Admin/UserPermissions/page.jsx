import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Settings,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  LayoutDashboard,
  ShoppingCart,
  Package,
  DollarSign,
  MessageSquare,
  UserCheck,
  Crown,
  User,
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";
import { toast } from "react-toastify";
import { Bounce, ToastContainer } from "react-toastify";
import { BsTruck } from "react-icons/bs";
import { BiMoney } from "react-icons/bi";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const UserPermissionsDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editPermissions, setEditPermissions] = useState({});
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [rootAdminId, setRootAdminId] = useState(null);

  const API_BASE_URL = `${URL}/api/admin/userpermission`;

  // Updated permission labels to match your backend model
  const permissionLabels = {
    dashboard: { label: "Dashboard", icon: LayoutDashboard },
    users: { label: "Users", icon: Users },
    orders: { label: "Orders", icon: ShoppingCart },
    rejected_orders: { label: "Rejected Orders", icon: AlertCircle },
    refunded_orders: { label: "Refunded Orders", icon: CheckCircle },
    shipped_orders: { label: "Shipped Orders", icon: BsTruck },
    seller_payouts: { label: "Payouts", icon: BiMoney },
    product_list: { label: "Products", icon: Package },
    commission: { label: "Commission", icon: DollarSign },
    disputes: { label: "Disputes", icon: MessageSquare },
    settings: { label: "Settings", icon: Settings },
    can_manage_permissions: { label: "Manage Permissions", icon: UserCheck },
  };

  useEffect(() => {
    fetchAdminPermissions();
  }, [currentPage]);

  const fetchAdminPermissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}?page=${currentPage}&limit=10`
      );
      const data = await response.json();

      if (data.success) {
        setAdmins(data.data.admins);
        setTotalPages(data.data.pagination.totalPages);

        // Find and set root admin ID from the fetched data
        const rootAdmin = data.data.admins.find(
          (admin) => admin.permissions?.is_root_admin === true
        );
        if (rootAdmin) {
          setRootAdminId(rootAdmin.id);
        }
      } else {
        throw new Error(data.message || "Failed to fetch admin permissions");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPermissions = (admin) => {
    if (admin.permissions?.is_root_admin) {
      return; // Cannot edit root admin
    }
    setEditingUser(admin.id);
    setEditPermissions(admin.permissions || {});
  };

  const handlePermissionChange = (permission, value) => {
    setEditPermissions((prev) => ({
      ...prev,
      [permission]: value,
    }));
  };

  const handleSavePermissions = async (userId) => {
    try {
      setSavingPermissions(true);
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requesterId: rootAdminId,
          permissions: editPermissions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the local state with animation
        setAdmins((prev) =>
          prev.map((admin) =>
            admin.id === userId
              ? { ...admin, permissions: data.data.permissions }
              : admin
          )
        );
        setEditingUser(null);
        setEditPermissions({});
        toast.success(data.message || "Permissions updated successfully");
      } else {
        throw new Error(data.message || "Failed to update permissions");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSavingPermissions(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditPermissions({});
  };

  const PermissionToggle = ({ permission, value, onChange, disabled }) => (
    <div className="flex items-center justify-center">
      <button
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 ${
          value ? "bg-[#f47458] shadow-lg" : "bg-gray-200"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ease-in-out shadow-md ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  if (loading) {
    return (
      //   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      //     <div className="text-center">
      //       <div className="relative">
      //         <div className="absolute inset-0 rounded-full animate-ping border-4 border-blue-300 opacity-20"></div>
      //       </div>
      //       <p className="mt-6 text-gray-600 font-medium animate-pulse">
      //         Loading admin permissions...
      //       </p>
      //     </div>
      //   </div>
      <CubeLoader />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md animate-fade-in">
          <div className="animate-bounce">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Permissions
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAdminPermissions}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Shield className="h-10 w-10 text-[#f47458]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ee6f5c] rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-4xl font-regular text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                User Permissions
              </h1>
              <p className="text-gray-600 mt-1">
                Manage admin user permissions and access controls
              </p>
            </div>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="text-center flex flex-col items-center justify-end py-10 px-6 font-semibold text-gray-900 min-w-[250px]">
                    <span>
                      <User className="h-4 w-4 text-gray-600" />
                    </span>
                    User
                  </th>
                  {Object.entries(permissionLabels).map(([key, config]) => (
                    <th
                      key={key}
                      className="text-center py-6 px-4 font-semibold text-gray-900 min-w-[140px]"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <config.icon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm">{config.label}</span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center py-6 px-6 font-semibold text-gray-900 min-w-[120px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => {
                  const isEditing = editingUser === admin.id;
                  const isRootAdmin = admin.permissions?.is_root_admin === true;
                  const permissions = isEditing
                    ? editPermissions
                    : admin.permissions || {};

                  return (
                    <tr
                      key={admin.id}
                      className={`border-b border-gray-100 transition-all duration-200 hover:bg-gray-50 ${
                        isRootAdmin
                          ? "bg-gradient-to-r from-purple-50 to-blue-50"
                          : ""
                      }`}
                      style={{
                        opacity: 0,
                        animation: `fadeInUp 0.6s ease-out ${
                          index * 100
                        }ms forwards`,
                      }}
                    >
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center capitalize justify-center text-white font-bold text-lg shadow-lg transition-all duration-200 hover:scale-110 ${
                                isRootAdmin
                                  ? "bg-gradient-to-r from-purple-500 to-blue-600"
                                  : "bg-gradient-to-r from-blue-500 to-cyan-600"
                              }`}
                            >
                              {admin.name.charAt(0).toUpperCase()}
                            </div>
                            {isRootAdmin && (
                              <Crown className="absolute -top-1 -right-1 h-5 w-5 text-yellow-500 animate-pulse" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <p className="font-bold text-gray-900 text-lg">
                                {admin.name}
                              </p>
                              {isRootAdmin && (
                                <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 animate-pulse">
                                  Root Admin
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {Object.keys(permissionLabels).map((permission) => (
                        <td key={permission} className="py-6 px-4">
                          <PermissionToggle
                            permission={permission}
                            value={permissions[permission] || false}
                            onChange={(value) =>
                              handlePermissionChange(permission, value)
                            }
                            disabled={!isEditing || isRootAdmin}
                          />
                        </td>
                      ))}

                      <td className="py-6 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {isRootAdmin ? (
                            <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                              Protected
                            </span>
                          ) : isEditing ? (
                            <div
                              className="flex gap-2 opacity-0"
                              style={{
                                animation: "fadeIn 0.3s ease-out forwards",
                              }}
                            >
                              <button
                                onClick={() => handleSavePermissions(admin.id)}
                                disabled={savingPermissions}
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white p-2 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
                              >
                                {savingPermissions ? (
                                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={savingPermissions}
                                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-2 rounded-lg hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditPermissions(admin)}
                              className="bg-gradient-to-r pointer-cursor from-[#f47458] to-[#ed4e2e] text-white px-4 py-2 rounded-lg hover:from-[#ed4e2e] hover:to-[#f47458] text-sm font-medium transition-all duration-300  transform hover:scale-105 shadow-lg"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-xl shadow-lg border border-gray-200 p-4 transform transition-all duration-300 hover:shadow-xl">
            <p className="text-sm text-gray-700 font-medium">
              Page{" "}
              <span className="font-bold text-blue-600">{currentPage}</span> of{" "}
              <span className="font-bold text-blue-600">{totalPages}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {admins.length === 0 && (
          <div
            className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-200 opacity-0"
            style={{ animation: "fadeIn 0.6s ease-out forwards" }}
          >
            <div className="animate-bounce">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Admin Users Found
            </h3>
            <p className="text-gray-600">
              There are no admin users with permissions to display.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPermissionsDashboard;
