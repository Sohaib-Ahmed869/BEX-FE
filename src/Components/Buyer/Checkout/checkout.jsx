import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  PenToolIcon as Tool,
  CreditCard,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import BuyerHeader from "../buyerHeader.jsx/buyerHeader";
import SuccessModal from "./successModal";
import OrderSuccessModal from "./successModal";
import { toast } from "react-toastify";

// Replace with your own Stripe publishable key when implementing
const stripePromise = loadStripe(
  "pk_test_51RR6vgPf2IrH0kypwuuEksNtruFIba4T4x2fQ84WliZRAx1tMHEnGBWGHFCNF2h19MSiv6FUviwEeekenVjfojCL00s9UwfZzL"
);

// Retip pricing data based on diameter
const retipPricing = {
  2: 48.0,
  2.5: 60.0,
  3: 84.0,
  3.5: 96.0,
  4: 108.0,
  4.5: 108.0,
  5: 120.0,
  5.5: 132.0,
  6: 144.0,
  6.5: 156.0,
  7: 168.0,
  8: 180.0,
  9: 192.0,
  10: 238.0,
  11: 252.0,
  12: 280.0,
  14: 384.0,
  15: 400.0,
  16: 416.0,
  18: 464.0,
  20: 540.0,
  22: 594.0,
  24: 630.0,
  25: 648.0,
  26: 684.0,
  27: 702.0,
  28: 720.0,
  29: 738.0,
  30: 840.0,
  31: 860.0,
  32: 900.0,
  33: 920.0,
  34: 940.0,
  35: 980.0,
  36: 1000.0,
  38: 1060.0,
  40: 1320.0,
  42: 1392.0,
  44: 1464.0,
  46: 1536.0,
  48: 1584.0,
  50: 1656.0,
  52: 1728.0,
  54: 1800.0,
  56: 1872.0,
  58: 1920.0,
  60: 1992.0,
};

// Modal component for retip options
const RetipModal = ({ isOpen, onClose, item, onAddRetip, onCancelRetip }) => {
  if (!isOpen) return null;

  const diameter = item.diameter || "0";
  const retipPrice = retipPricing[diameter] || 0;

  return (
    <div className="fixed inset-0 backdrop-blur-sm shadow-2xl border border-gray-200 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Retip Options</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
              <img
                src={item.image_link || "/api/placeholder/64/64"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-gray-600">{diameter}" Core Drill Bit</p>
            </div>
          </div>

          <div className="border-t border-b border-gray-300 py-4 my-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Retip Service</p>
                <p className="text-gray-600 text-sm">
                  Restore the cutting edge of your {diameter}" core drill bit
                </p>
              </div>
              <p className="font-semibold">${retipPrice.toFixed(2)}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Retipping extends the life of your core bit by replacing the worn
            diamond segments with new ones, giving you like-new cutting
            performance.
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          {item.retipAdded ? (
            <button
              onClick={() => {
                onCancelRetip(item.id);
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Remove Retipping (${retipPrice.toFixed(2)})
            </button>
          ) : (
            <button
              onClick={() => {
                onAddRetip(item.id, retipPrice);
                onClose();
              }}
              className="px-4 py-2 bg-[#e06449] text-white rounded-md hover:bg-[#c9583e] transition-colors"
            >
              Add Retipping (${retipPrice.toFixed(2)})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CheckoutForm = ({
  onStepChange,
  formData,
  setFormData,
  items,
  subtotal,
  tax,
  commissionFee,
  retipTotal,
  total,
  showSuccessModal,
  setOrderId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(true);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment method
      const cardElement = elements.getElement(CardElement);

      // Format address properly
      const shippingAddress = {
        address: {
          line1: formData.address1,
          line2: formData.address2 || "", // Handle empty address line 2
          postal_code: formData.postalCode,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
        name: `${formData.firstName} ${formData.lastName}`, // Add name to shipping
        email: formData.email, // Add email to shipping
      };

      // Create payment intent on the server
      const response = await fetch(
        "http://localhost:5000/api/checkout/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Math.round(total * 100), // Convert to cents
            shipping: shippingAddress,
          }),
        }
      );

      const paymentIntentData = await response.json();

      if (!paymentIntentData.clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.cardName,
              email: formData.email,
            },
          },
        }
      );

      if (result.error) {
        setPaymentError(result.error.message);
        toast.error("Payment failed: " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);

        // IMPORTANT: Make sure we're sending validated IDs that exist in the products table
        // First fetch and validate product IDs from the server if possible
        // For now, using the items as-is but ensure the ID being sent matches product IDs in the database

        // Create order in database with consistent address format
        const orderResponse = await fetch(
          `http://localhost:5000/api/checkout/create-order/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: items.map((item) => ({
                id: item.product_id, // Ensure this is the correct product ID from database
                quantity: item.quantity,
                price: item.price,
                title: item.title,
                retipAdded: item.retipAdded || false,
                retipPrice: item.retipAdded ? item.retipPrice || 0 : 0,
              })),
              shipping: shippingAddress,
              payment: {
                id: result.paymentIntent.id,
                amount: total,
                status: "completed",
              },
            }),
          }
        );

        const orderData = await orderResponse.json();

        if (orderData.success) {
          // Redirect to success page
          setOrderId(orderData.orderId.split("-").at(-1));
          showSuccessModal(true);
          console.log("Order created:", orderData);
        } else if (orderData.error) {
          setPaymentError(orderData.error);
        }
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleBackToShipping = () => {
    onStepChange("shipping");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Card Input */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-3">
          Card information
        </label>

        <div className="border-1 border-gray-400 rounded-md overflow-hidden focus:outline-none focus:ring-1 focus:ring-[#e06449]">
          <div className="p-3 relative">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    lineHeight: "24px",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                    ":-webkit-autofill": {
                      color: "#424770",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                    iconColor: "#9e2146",
                  },
                  complete: {
                    color: "#424770",
                  },
                },
                hidePostalCode: true,
                iconStyle: "solid",
              }}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="cardName" className="block text-sm text-gray-600 mb-1">
          Cardholder name
        </label>
        <input
          type="text"
          id="cardName"
          name="cardName"
          value={formData.cardName || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border-1 border-gray-400  rounded-md focus:outline-none  focus:ring-1 focus:ring-[#e06449]"
          placeholder="Full name on card"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="country" className="block text-sm text-gray-600 mb-1">
          Country or region
        </label>
        <select
          id="country"
          name="country"
          value={formData.country || "United States"}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border-1 border-gray-400  rounded-md focus:outline-none focus:ring-1 focus:ring-[#e06449]"
          required
        >
          <option value="Nigeria">Nigeria</option>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
        </select>
      </div>

      {paymentError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {paymentError}
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBackToShipping}
          className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </button>

        <button
          type="submit"
          className="bg-[#e06449] text-white font-medium px-6 py-3 rounded-md hover:bg-[#c9583e] transition-colors flex items-center justify-center"
          disabled={isProcessing || !stripe}
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Complete order"
          )}
        </button>
      </div>
    </form>
  );
};

const ShippingForm = ({ onStepChange, formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStepChange("payment");
  };

  const handleCancel = () => {
    // Redirect to products page
    window.location.href = "/products";
  };

  return (
    <form onSubmit={handleSubmit}>
      <>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm text-gray-600 mb-1"
            >
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e06449]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm text-gray-600 mb-1"
            >
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e06449]"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e06449]"
            placeholder="example@email.com"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="address1"
            className="block text-sm text-gray-600 mb-1"
          >
            Address line 1
          </label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={formData.address1 || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e06449]"
            placeholder="Street address or P.O. Box"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="address2"
            className="block text-sm text-gray-600 mb-1"
          >
            Address line 2
          </label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={formData.address2 || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e06449]"
            placeholder="Apt, suite, unit, building, floor, etc."
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="city" className="block text-sm text-gray-600 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e06449]"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm text-gray-600 mb-1">
              State / Province
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e06449]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm text-gray-600 mb-1"
            >
              Postal code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e06449]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm text-gray-600 mb-1"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country || "United States"}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e06449]"
              required
            >
              <option value="Nigeria">Nigeria</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>
        </div>
      </>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-[#e06449] text-white font-medium px-6 py-3 rounded-md hover:bg-[#c9583e] transition-colors flex items-center"
        >
          Continue to payment
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [checkoutStep, setCheckoutStep] = useState("shipping"); // "shipping", "payment"
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemsWithRetip, setItemsWithRetip] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  // Get cart data from Redux store
  const {
    items: cartItems,
    totalQuantity,
    totalPrice,
  } = useSelector((state) => state.cart);

  // Initialize items with retip status
  useEffect(() => {
    setItemsWithRetip(
      cartItems.map((item) => ({
        ...item,
        retipAdded: false,
        retipPrice:
          item.category === "Core Drill Bits" && item.diameter
            ? retipPricing[item.diameter.toString()] || 0
            : 0,
      }))
    );
  }, [cartItems]);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    cardName: "",
  });

  // Handle opening retip modal
  const handleOpenRetipModal = (item) => {
    // Find the current state of the item in itemsWithRetip
    const currentItem = itemsWithRetip.find((i) => i.id === item.id);
    setSelectedItem(currentItem);
    setModalOpen(true);
  };

  // Handle adding retip service - this function correctly updates state
  const handleAddRetip = (itemId, retipPrice) => {
    setItemsWithRetip(
      itemsWithRetip.map((item) =>
        item.id === itemId ? { ...item, retipAdded: true } : item
      )
    );
  };

  // Handle canceling retip service - this function is correct but needed to be called with the right item
  const handleCancelRetip = (itemId) => {
    setItemsWithRetip(
      itemsWithRetip.map((item) =>
        item.id === itemId ? { ...item, retipAdded: false } : item
      )
    );
  };
  // Calculate order summary values
  const subtotal = itemsWithRetip.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate retip total
  const retipTotal = itemsWithRetip.reduce(
    (sum, item) => sum + (item.retipAdded ? item.retipPrice : 0),
    0
  );

  const tax = subtotal * 0.0109; // Example tax rate
  const commissionFee = subtotal * 0.05; // 5% commission fee
  const shipping = 0; // Free shipping
  const total = subtotal + tax + commissionFee + shipping + retipTotal;

  return (
    <>
      <BuyerHeader />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Checkout forms */}
          <div className="w-full md:w-2/3">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

              {/* Checkout progress indicator */}
              <div className="flex items-center mb-8">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      checkoutStep === "shipping"
                        ? "bg-[#e06449] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {checkoutStep === "shipping" ? "1" : <Check size={16} />}
                  </div>
                  <span
                    className={`ml-2 ${
                      checkoutStep === "shipping"
                        ? "text-[#e06449] font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    Shipping
                  </span>
                </div>

                <div className="mx-4 h-px w-16 bg-gray-200"></div>

                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      checkoutStep === "payment"
                        ? "bg-[#e06449] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`ml-2 ${
                      checkoutStep === "payment"
                        ? "text-[#e06449] font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    Payment
                  </span>
                </div>
              </div>

              {/* Shipping Details Form */}
              {checkoutStep === "shipping" && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Shipping details</h2>
                  <ShippingForm
                    onStepChange={setCheckoutStep}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              )}

              {/* Payment Details Form */}
              {checkoutStep === "payment" && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Payment details</h2>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      onStepChange={setCheckoutStep}
                      formData={formData}
                      setFormData={setFormData}
                      items={itemsWithRetip}
                      subtotal={subtotal}
                      tax={tax}
                      commissionFee={commissionFee}
                      retipTotal={retipTotal}
                      total={total}
                      showSuccessModal={setShowSuccessModal}
                      setOrderId={setOrderId}
                    />
                  </Elements>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Order summary */}
          <div className="w-full md:w-1/3">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>

              {/* Product summary */}
              <div className="mb-4 space-y-4">
                {itemsWithRetip.map((item) => (
                  <div
                    key={item.id}
                    className="pb-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden mr-4">
                        <img
                          src={item.image_link || "/api/placeholder/80/80"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.title}</h3>
                          {item.category === "Core Drill Bits" && (
                            <div>
                              {item.retipAdded ? (
                                <span
                                  onClick={() => handleOpenRetipModal(item)}
                                  className="text-green-600 text-sm flex items-center"
                                >
                                  <Check size={14} className="mr-1" /> Retip
                                  options
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleOpenRetipModal(item)}
                                  className="flex items-center text-sm text-[#e06449] hover:text-[#c9583e]"
                                >
                                  <Tool size={14} className="mr-1" /> Retip
                                  options
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between mt-2">
                          <p className="text-gray-700">${item.price}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>

                        {item.retipAdded && (
                          <div className="mt-2 bg-orange-50 p-2 rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 flex items-center">
                                <Tool size={12} className="mr-1" /> Retipping
                                service
                              </span>
                              <span className="text-sm font-medium">
                                ${item.retipPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order details */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Sub total</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {retipTotal > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Retipping services</span>
                    <span className="font-medium">
                      ${retipTotal.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Commission fee</span>
                  <span className="font-medium">
                    ${commissionFee.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-[#e06449]">Free</span>
                </div>

                <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retip Modal */}
      {selectedItem && (
        <RetipModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          item={selectedItem}
          onAddRetip={handleAddRetip}
          onCancelRetip={handleCancelRetip}
        />
      )}
      {showSuccessModal && (
        <OrderSuccessModal isOpen={showSuccessModal} orderId={orderId} />
      )}
    </>
  );
}
