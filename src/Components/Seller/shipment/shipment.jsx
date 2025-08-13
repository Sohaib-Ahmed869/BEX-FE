import React, { useState, useEffect } from "react";
import {
  Ship,
  Package2,
  Clock,
  CheckCircle,
  Calendar,
  Truck,
  X,
  AlertCircle,
  MapPin,
  Phone,
  User,
  RefreshCw,
  Ban,
  RotateCcw,
  ArrowLeft,
  ExternalLink,
  Copy,
  Download,
  Loader2,
  Play,
  TestTube,
  Info,
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";
import { toast, ToastContainer, Bounce } from "react-toastify";

const ShipmentManagement = ({ orderId, orderData, onClose, onRefresh }) => {
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [isShipmentLoading, setIsShipmentLoading] = useState(false);
  const [isPickupLoading, setIsPickupLoading] = useState(false);
  const [isVoidLoading, setIsVoidLoading] = useState(false);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [shipmentStep, setShipmentStep] = useState(1);
  const [createdShipment, setCreatedShipment] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [simulationStatuses, setSimulationStatuses] = useState([]);
  const [selectedSimulationStatus, setSelectedSimulationStatus] = useState("");
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  const [pickupData, setPickupData] = useState({
    pickupDate: "",
    readyTime: "09:00",
    closeTime: "17:00",
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const URL = import.meta.env.VITE_REACT_BACKEND_URL;

  const approvedItems =
    orderData?.orderItems?.filter(
      (item) => item.orderStatus.toLowerCase() === "approved"
    ) || [];

  const hasApprovedItems = approvedItems.length > 0;

  useEffect(() => {
    setIsVisible(true);
    if (orderId) {
      fetchShipments();
      fetchSimulationStatuses();
    }
  }, [orderId]);

  // Fetch simulation statuses for development mode
  const fetchSimulationStatuses = async () => {
    try {
      const response = await fetch(`${URL}/api/shipments/simulation-statuses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setSimulationStatuses(data.statuses);
        setIsDevelopmentMode(false);
      }
    } catch (error) {
      // Not in development mode or endpoint not available
      setIsDevelopmentMode(false);
    }
  };

  // Fetch existing shipments for this order
  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/shipments/seller/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const orderShipments = data.shipments.filter(
          (s) => s.order_id === orderId
        );
        setShipments(orderShipments);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch shipments:", error);
    }
  };

  // Create shipment function
  const createShipment = async () => {
    setIsShipmentLoading(true);
    try {
      const createResponse = await fetch(
        `${URL}/api/shipments/create/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createData = await createResponse.json();

      if (createData.success) {
        const sellerShipment = createData.shipments.find(
          (shipment) => shipment.seller_id === userId
        );

        if (sellerShipment) {
          const processResponse = await fetch(
            `${URL}/api/shipments/process-ups/${sellerShipment.id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const processData = await processResponse.json();

          if (processData.success) {
            setCreatedShipment({
              ...sellerShipment,
              trackingNumber: processData.trackingNumber,
              labelUrl: processData.labelUrl,
            });
            setShipmentStep(3);
            fetchShipments();
            onRefresh?.();
          } else {
            throw new Error(
              processData.message || "Failed to process UPS shipment"
            );
          }
        } else {
          throw new Error("No shipment found for this seller");
        }
      } else {
        throw new Error(createData.message || "Failed to create shipment");
      }
    } catch (error) {
      console.error("Shipment creation error:", error);
      toast.error(`Failed to create shipment: ${error.message}`);
      setShipmentStep(1);
    } finally {
      setIsShipmentLoading(false);
    }
  };

  // Schedule pickup
  const schedulePickup = async () => {
    if (!selectedShipment) return;

    setIsPickupLoading(true);
    try {
      const formattedDate = pickupData.pickupDate.replace(/-/g, "");

      const response = await fetch(
        `${URL}/api/shipments/schedule-pickup/${selectedShipment.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pickupDate: formattedDate,
            readyTime: pickupData.readyTime.replace(":", "") + "00",
            closeTime: pickupData.closeTime.replace(":", "") + "00",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Pickup scheduled successfully!");
        setShowPickupModal(false);
        fetchShipments();
        onRefresh?.();
      } else {
        throw new Error(data.message || "Failed to schedule pickup");
      }
    } catch (error) {
      console.error("Pickup scheduling error:", error);
      toast.error(`${error.message}`);
    } finally {
      setIsPickupLoading(false);
    }
  };

  // Cancel pickup
  const cancelPickup = async (shipmentId) => {
    try {
      const response = await fetch(
        `${URL}/api/shipments/cancel-pickup/${shipmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Pickup cancelled successfully!");
        fetchShipments();
        onRefresh?.();
      } else {
        throw new Error(data.message || "Failed to cancel pickup");
      }
    } catch (error) {
      console.error("Pickup cancellation error:", error);
      toast.error(`Failed to cancel pickup: ${error.message}`);
    }
  };

  const canVoidShipment = (shipment) => {
    if (!shipment.created_at) return false;

    const createdTime = new Date(shipment.created_at);
    const now = new Date();
    const hoursSinceCreated = (now - createdTime) / (1000 * 60 * 60);

    // Allow voiding within 24 hours for test environment
    return (
      hoursSinceCreated < 24 &&
      (shipment.status === "created" || shipment.status === "pickup_scheduled")
    );
  };

  // Get void restriction message
  const getVoidRestrictionMessage = (shipment) => {
    if (!shipment.created_at) return "Creation time unknown";

    const createdTime = new Date(shipment.created_at);
    const now = new Date();
    const hoursSinceCreated = (now - createdTime) / (1000 * 60 * 60);

    if (hoursSinceCreated >= 24) {
      return "Void period expired (24+ hours old)";
    }

    if (shipment.status === "shipped" || shipment.status === "in_transit") {
      return "Already shipped - cannot void";
    }

    if (shipment.status === "delivered") {
      return "Already delivered - cannot void";
    }

    return "Can be voided";
  };

  // Void shipment with modal confirmation
  const handleVoidShipment = (shipment) => {
    setSelectedShipment(shipment);
    setShowVoidModal(true);
  };

  const confirmVoidShipment = async () => {
    if (!selectedShipment) return;

    setIsVoidLoading(true);
    try {
      const response = await fetch(
        `${URL}/api/shipments/void/${selectedShipment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Shipment voided successfully!");
        setShowVoidModal(false);
        fetchShipments();
        onRefresh?.();
      } else {
        throw new Error(data.message || "Failed to void shipment");
      }
    } catch (error) {
      console.error("Shipment void error:", error);

      // Handle specific error messages from UPS
      let errorMessage = error.message;
      if (errorMessage.includes("void period")) {
        errorMessage =
          "This shipment is outside the allowed void period. Contact UPS customer service for assistance.";
      } else if (errorMessage.includes("already been picked up")) {
        errorMessage =
          "This shipment has been picked up and cannot be voided. You may need to create a return shipment.";
      }

      toast.error(errorMessage);
    } finally {
      setIsVoidLoading(false);
    }
  };

  // Enhanced track shipment with simulation support
  const handleTrackShipment = (shipment) => {
    setSelectedShipment(shipment);
    if (isDevelopmentMode) {
      setShowTrackingModal(true);
    } else {
      trackShipment(shipment.id);
    }
  };

  const trackShipment = async (shipmentId, simulateStatus = null) => {
    setIsTrackingLoading(true);
    try {
      const requestBody = simulateStatus ? { simulateStatus } : {};

      const response = await fetch(`${URL}/api/shipments/track/${shipmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        const message = simulateStatus
          ? `Tracking simulated to status: ${simulateStatus}`
          : "Tracking information updated!";
        toast.success(message);

        if (simulateStatus) {
          setShowTrackingModal(false);
        }
        fetchShipments();
      } else {
        throw new Error(data.message || "Failed to track shipment");
      }
    } catch (error) {
      console.error("Tracking error:", error);
      toast.error(`Failed to track shipment: ${error.message}`);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      created: "bg-blue-100 text-blue-800 border-blue-200",
      pickup_scheduled: "bg-purple-100 text-purple-800 border-purple-200",
      shipped: "bg-green-100 text-green-800 border-green-200",
      in_transit: "bg-blue-100 text-blue-800 border-blue-200",
      out_for_delivery: "bg-orange-100 text-orange-800 border-orange-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      exception: "bg-red-100 text-red-800 border-red-200",
      cancelled: "bg-gray-100 text-gray-800 border-gray-200",
      returned: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    if (dateString.length === 8) {
      return `${dateString.slice(0, 4)}-${dateString.slice(
        4,
        6
      )}-${dateString.slice(6, 8)}`;
    }
    return new Date(dateString).toLocaleDateString();
  };

  const getMinPickupDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleDownloadLabel = (labelUrl, trackingNumber) => {
    if (!labelUrl) {
      toast.error("No label URL available");
      return;
    }

    try {
      const base64Data = labelUrl.startsWith("data:")
        ? labelUrl
        : `data:image/gif;base64,${labelUrl}`;
      const link = document.createElement("a");
      link.href = base64Data;
      link.download = `ups-label-${trackingNumber || Date.now()}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Label downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download label");
    }
  };

  const handleViewLabel = (labelUrl) => {
    if (!labelUrl) {
      toast.error("No label URL available");
      return;
    }

    try {
      if (
        labelUrl.startsWith("R0lGOD") ||
        labelUrl.includes("base64") ||
        /^[A-Za-z0-9+/=]+$/.test(labelUrl.substring(0, 50))
      ) {
        const base64Data = labelUrl.startsWith("data:")
          ? labelUrl
          : `data:image/gif;base64,${labelUrl}`;

        const newWindow = window.open("", "_blank");
        if (newWindow) {
          newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>UPS Shipping Label</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                }
                .header {
                  background: white;
                  padding: 15px 30px;
                  border-radius: 8px;
                  margin-bottom: 20px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  display: flex;
                  gap: 15px;
                  align-items: center;
                }
                .label-container {
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  max-width: 100%;
                  overflow: auto;
                }
                .label-image {
                  max-width: 100%;
                  height: auto;
                  border: 1px solid #ddd;
                }
                .btn {
                  background: #F47458;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 14px;
                  text-decoration: none;
                  display: inline-flex;
                  align-items: center;
                  gap: 8px;
                }
                .btn:hover {
                  background: #e0634a;
                }
                .btn-secondary {
                  background: #6b7280;
                }
                .btn-secondary:hover {
                  background: #4b5563;
                }
                @media print {
                  .header { display: none; }
                  .label-container { 
                    box-shadow: none; 
                    margin: 0; 
                    padding: 0;
                  }
                  body { background: white; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h2 style="margin: 0; color: #374151;">UPS Shipping Label</h2>
                <button class="btn" onclick="window.print()">
                  🖨️ Print Label
                </button>
                <button class="btn btn-secondary" onclick="downloadLabel()">
                  📥 Download
                </button>
                <button class="btn btn-secondary" onclick="window.close()">
                  ✕ Close
                </button>
              </div>
              <div class="label-container">
                <img src="${base64Data}" alt="UPS Shipping Label" class="label-image" id="labelImage" />
              </div>
              <script>
                function downloadLabel() {
                  const link = document.createElement('a');
                  link.href = '${base64Data}';
                  link.download = 'ups-shipping-label-${Date.now()}.gif';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
                
                window.focus();
              </script>
            </body>
          </html>
        `);
          newWindow.document.close();
        } else {
          const link = document.createElement("a");
          link.href = base64Data;
          link.download = `ups-label-${Date.now()}.gif`;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Label download started");
        }
      } else {
        const newWindow = window.open(labelUrl, "_blank");
        if (!newWindow) {
          window.location.href = labelUrl;
        }
      }
    } catch (error) {
      console.error("Failed to open label:", error);
      toast.error(
        "Failed to open shipping label. Please try downloading instead."
      );

      try {
        const base64Data = labelUrl.startsWith("data:")
          ? labelUrl
          : `data:image/gif;base64,${labelUrl}`;
        const link = document.createElement("a");
        link.href = base64Data;
        link.download = `ups-label-${Date.now()}.gif`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Label download started as fallback");
      } catch (downloadError) {
        console.error("Fallback download also failed:", downloadError);
        toast.error("Unable to process label. Please contact support.");
      }
    }
  };

  if (loading) {
    return <CubeLoader />;
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#F47458] hover:bg-orange-50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Order Details</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F47458] bg-opacity-10 rounded-lg">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Shipment Management
                  </h1>
                  <p className="text-sm text-gray-500">
                    Order #{orderId?.slice(0, 8)}
                    {isDevelopmentMode && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        DEV MODE
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Shipments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {shipments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Ready to Ship
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {approvedItems.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F47458] bg-opacity-10 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    shipments.filter(
                      (s) =>
                        s.status === "shipped" ||
                        s.status === "in_transit" ||
                        s.status === "out_for_delivery"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Shipments */}
        {shipments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Existing Shipments
            </h2>
            <div className="grid gap-6">
              {shipments.map((shipment, index) => (
                <div
                  key={shipment.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 animate-fadeInUp`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-xl">
                        <Package2 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Shipment #{shipment.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {shipment.tracking_number
                            ? `Tracking: ${shipment.tracking_number}`
                            : "No tracking number"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Created{" "}
                          {new Date(shipment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        shipment.status
                      )}`}
                    >
                      {shipment.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Weight
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {shipment.weight} lbs
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Service
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {shipment.service_description}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Pickup Date
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatDate(shipment.pickup_date)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Status
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">
                        {shipment.status.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {shipment.status === "created" && (
                      <button
                        onClick={() => {
                          setSelectedShipment(shipment);
                          setShowPickupModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <Calendar className="h-4 w-4" />
                        Schedule Pickup
                      </button>
                    )}

                    {shipment.status === "pickup_scheduled" && (
                      <button
                        onClick={() => cancelPickup(shipment.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <Ban className="h-4 w-4" />
                        Cancel Pickup
                      </button>
                    )}

                    {(shipment.status === "created" ||
                      shipment.status === "pickup_scheduled") && (
                      <button
                        onClick={() => handleVoidShipment(shipment)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <X className="h-4 w-4" />
                        Cancel Shipment
                      </button>
                    )}

                    {shipment.tracking_number && (
                      <button
                        onClick={() => handleTrackShipment(shipment)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        {isDevelopmentMode ? (
                          <>
                            <TestTube className="h-4 w-4" />
                            Simulate Tracking
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4" />
                            Update Tracking
                          </>
                        )}
                      </button>
                    )}

                    {shipment.label_url && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewLabel(shipment.label_url)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#F47458] text-white rounded-lg hover:bg-[#e0634a] transition-colors duration-200 text-sm font-medium"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Label
                        </button>
                        <button
                          onClick={() =>
                            handleDownloadLabel(
                              shipment.label_url,
                              shipment.tracking_number
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    )}

                    {shipment.tracking_number && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            shipment.tracking_number
                          );
                          toast.success("Tracking number copied!");
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Tracking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create New Shipment Section */}
        {hasApprovedItems && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-[#F47458] bg-opacity-10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Truck className="h-10 w-10 text-[#fff]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Create New Shipment
              </h3>
              <p className="text-gray-600 mb-6">
                You have {approvedItems.length} approved item
                {approvedItems.length !== 1 ? "s" : ""} ready for shipment
              </p>
              <button
                onClick={() => setShowShipmentModal(true)}
                disabled={isShipmentLoading}
                className="w-full bg-[#F47458] text-white py-3 px-6 rounded-lg hover:bg-[#e0634a] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Truck className="h-5 w-5" />
                {isShipmentLoading
                  ? "Creating Shipment..."
                  : "Create New Shipment"}
              </button>
            </div>
          </div>
        )}

        {!hasApprovedItems && shipments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Package2 className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Items Ready for Shipment
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Approve order items first to create shipments. Once items are
              approved, you'll be able to create and manage shipments from here.
            </p>
          </div>
        )}
      </div>

      {/* Shipment Creation Modal */}
      {showShipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                Create Shipment
              </h2>
              <button
                onClick={() => setShowShipmentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {shipmentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Items to Ship ({approvedItems.length})
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {approvedItems.map((item, index) => (
                        <div
                          key={item.orderItemId}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="w-12 h-12 bg-[#F47458] bg-opacity-10 rounded-xl flex items-center justify-center">
                            <Package2 className="h-6 w-6 text-[#fff]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.itemTitle}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${item.itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setShowShipmentModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShipmentStep(2);
                        createShipment();
                      }}
                      className="px-6 py-2 bg-[#F47458] text-white rounded-lg hover:bg-[#e0634a] transition-colors duration-200 flex items-center gap-2 font-medium"
                    >
                      <Truck className="h-4 w-4" />
                      Create Shipment
                    </button>
                  </div>
                </div>
              )}

              {shipmentStep === 2 && (
                <div className="text-center py-12">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-[#F47458] animate-spin" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Creating Shipment...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we process your shipment with UPS. This
                    may take a few moments.
                  </p>
                </div>
              )}

              {shipmentStep === 3 && createdShipment && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Shipment Created Successfully!
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Your shipment is ready for pickup. You can now schedule a
                    pickup or print the shipping label.
                  </p>

                  <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Shipment Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          Tracking Number:
                        </span>
                        <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded">
                          {createdShipment.trackingNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          Carrier:
                        </span>
                        <span className="text-gray-900">UPS</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          Service:
                        </span>
                        <span className="text-gray-900">Ground</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          createdShipment.trackingNumber
                        );
                        toast.success("Tracking number copied!");
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Tracking Number
                    </button>
                    <button
                      onClick={() => {
                        setSelectedShipment(createdShipment);
                        setShowShipmentModal(false);
                        setShowPickupModal(true);
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule Pickup
                    </button>
                    <button
                      onClick={() => {
                        setShowShipmentModal(false);
                        fetchShipments();
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-2 bg-[#F47458] text-white rounded-lg hover:bg-[#e0634a] transition-colors duration-200"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pickup Scheduling Modal */}
      {showPickupModal && selectedShipment && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Schedule Pickup
                </h2>
              </div>
              <button
                onClick={() => setShowPickupModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Schedule a pickup for shipment #
                  {selectedShipment.id?.slice(0, 8)}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">
                        Pickup Address:
                      </p>
                      <p className="text-blue-700 leading-relaxed">
                        {selectedShipment.shipper_address?.line1}
                        <br />
                        {selectedShipment.shipper_address?.city},{" "}
                        {selectedShipment.shipper_address?.state}{" "}
                        {selectedShipment.shipper_address?.postalCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pickup Date
                </label>
                <input
                  type="date"
                  min={getMinPickupDate()}
                  value={pickupData.pickupDate}
                  onChange={(e) =>
                    setPickupData((prev) => ({
                      ...prev,
                      pickupDate: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47458] focus:border-[#F47458] transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ready Time
                  </label>
                  <input
                    type="time"
                    value={pickupData.readyTime}
                    onChange={(e) =>
                      setPickupData((prev) => ({
                        ...prev,
                        readyTime: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47458] focus:border-[#F47458] transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Close Time
                  </label>
                  <input
                    type="time"
                    value={pickupData.closeTime}
                    onChange={(e) =>
                      setPickupData((prev) => ({
                        ...prev,
                        closeTime: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47458] focus:border-[#F47458] transition-all duration-200"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-yellow-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-2">
                      Important Pickup Guidelines:
                    </p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>
                        Pickup must be scheduled at least 1 day in advance
                      </li>
                      <li>
                        Ensure someone is available during the specified time
                        window
                      </li>
                      <li>
                        Have packages ready and labeled before pickup time
                      </li>
                      <li>Driver will need access to pickup location</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPickupModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={schedulePickup}
                disabled={isPickupLoading || !pickupData.pickupDate}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 font-medium"
              >
                {isPickupLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    Schedule Pickup
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Void Shipment Confirmation Modal */}
      {showVoidModal && selectedShipment && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Cancel Shipment
                </h2>
              </div>
              <button
                onClick={() => setShowVoidModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confirm Cancel Shipment Action
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel this shipment? This action
                  cannot be undone.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    Shipment Details:
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipment ID:</span>
                      <span className="font-mono text-gray-900">
                        {selectedShipment.id?.slice(0, 8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="font-mono text-gray-900">
                        {selectedShipment.tracking_number || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">
                        {new Date(selectedShipment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          selectedShipment.status
                        )}`}
                      >
                        {selectedShipment.status
                          .replace("_", " ")
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {!canVoidShipment(selectedShipment) && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-semibold">
                          Cannot Void Shipment
                        </p>
                        <p className="text-red-700 text-sm mt-1">
                          {getVoidRestrictionMessage(selectedShipment)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Important:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Voiding will cancel the shipment and invalidate tracking
                      </li>
                      <li>Order items will be returned to "approved" status</li>
                      <li>
                        You'll need to create a new shipment to ship these items
                      </li>
                      <li>This action cannot be undone</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowVoidModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmVoidShipment}
                disabled={isVoidLoading || !canVoidShipment(selectedShipment)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 font-medium"
              >
                {isVoidLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Voiding...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Void Shipment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Simulation Modal (Development Mode) */}
      {showTrackingModal && selectedShipment && isDevelopmentMode && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TestTube className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Simulate Tracking Status
                  </h2>
                  <p className="text-sm text-gray-500">Development Mode</p>
                </div>
              </div>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">
                      Development Mode Active
                    </p>
                    <p>
                      You can simulate different tracking statuses to test the
                      shipment progression. In production, this will update with
                      real UPS tracking data.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Current Status:
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      selectedShipment.status
                    )}`}
                  >
                    {selectedShipment.status.replace("_", " ").toUpperCase()}
                  </span>
                </p>

                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select New Status to Simulate:
                </label>
                <select
                  value={selectedSimulationStatus}
                  onChange={(e) => setSelectedSimulationStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Choose a status...</option>
                  {simulationStatuses.map((status) => (
                    <option key={status.key} value={status.key}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Current Tracking:
                </h4>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Tracking Number:</span>
                    <span className="font-mono">
                      {selectedShipment.tracking_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>
                      {new Date(selectedShipment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>
                      {new Date(selectedShipment.updated_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedSimulationStatus && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Play className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">Ready to Simulate</p>
                      <p>
                        This will simulate the tracking status changing to:
                        <strong className="ml-1">
                          {
                            simulationStatuses.find(
                              (s) => s.key === selectedSimulationStatus
                            )?.label
                          }
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowTrackingModal(false);
                  trackShipment(selectedShipment.id);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Update Real Tracking
              </button>
              <button
                onClick={() =>
                  trackShipment(selectedShipment.id, selectedSimulationStatus)
                }
                disabled={isTrackingLoading || !selectedSimulationStatus}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 font-medium"
              >
                {isTrackingLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4" />
                    Simulate Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ShipmentManagement;
