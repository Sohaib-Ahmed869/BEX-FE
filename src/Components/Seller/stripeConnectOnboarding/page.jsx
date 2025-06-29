import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  CreditCard,
  User,
  Building,
  ExternalLink,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";

const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const StripeConnectOnboarding = () => {
  const [loading, setLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [onboardingUrl, setOnboardingUrl] = useState("");
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  // Check if seller already has a connected account
  useEffect(() => {
    checkExistingAccount();
  }, []);

  const checkExistingAccount = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${URL}/api/stripe-connect/check-account`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.hasAccount) {
          setAccountId(data.accountId);
          setAccountStatus(data.status);
        }
        setInitialLoading(false);
      }
    } catch (err) {
      setInitialLoading(false);
      console.error("Error checking account:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  const createExpressAccount = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${URL}/api/stripe-connect/create-express-account`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "express",
            country: "US", // You can make this dynamic based on seller's location
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAccountId(data.accountId);
        setOnboardingUrl(data.onboardingUrl);
        setSuccess(
          "Express account created successfully! Please complete the onboarding process."
        );
      } else {
        setError(data.error || "Failed to create Express account");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateOnboardingLink = async () => {
    if (!accountId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${URL}/api/stripe-connect/create-onboarding-link`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountId: accountId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setOnboardingUrl(data.url);
        // Redirect to Stripe onboarding
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to generate onboarding link");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshAccountStatus = async () => {
    if (!accountId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${URL}/api/stripe-connect/account-status/${accountId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setAccountStatus(data.status);
        setSuccess("Account status updated successfully!");
      }
    } catch (err) {
      setError("Failed to refresh account status");
    } finally {
      setLoading(false);
    }
  };

  const openDashboard = async () => {
    setDashboardLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${URL}/api/stripe-connect/create-stripe-dashboard-link`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        window.open(data.loginUrl, "_blank");
      } else {
        setError(data.error || "Failed to generate dashboard link");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setDashboardLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "complete":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200";
      default:
        return "text-slate-700 bg-slate-50 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Loader2 className="w-5 h-5 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };
  if (initialLoading) {
    return <CubeLoader />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Stripe Connect Setup
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Set up your seller account to receive payments securely and
            efficiently from customers worldwide
          </p>
        </div>

        {/* Current Status Card */}
        {accountId && (
          <div className="mb-8 p-8 border border-gray-200 rounded-3xl bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-600" />
                Account Status
              </h2>
              <button
                onClick={refreshAccountStatus}
                disabled={loading}
                className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    loading
                      ? "animate-spin"
                      : "group-hover:rotate-180 transition-transform duration-300"
                  }`}
                />
                {loading ? "Refreshing..." : "Refresh Status"}
              </button>
            </div>

            <div
              className={`flex items-center p-5 rounded-2xl border-2 ${getStatusColor(
                accountStatus
              )} transition-all duration-300 hover:scale-[1.02]`}
            >
              {getStatusIcon(accountStatus)}
              <div className="ml-4">
                <p className="font-semibold text-lg capitalize">
                  {accountStatus || "Unknown"}
                </p>
                <p className="text-sm opacity-75 font-mono">
                  Account ID: {accountId}
                </p>
              </div>
            </div>

            {/* Dashboard Access for Complete Accounts */}
            {accountStatus === "complete" && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={openDashboard}
                  disabled={dashboardLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {dashboardLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  {dashboardLoading ? "Opening..." : "Open Stripe Dashboard"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Onboarding Steps */}
        <div className="space-y-8">
          {/* Step 1: Create Express Account */}
          <div className="group border border-gray-200 rounded-3xl p-8 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up-delay-1">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    accountId
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg group-hover:scale-110"
                  }`}
                >
                  {accountId ? (
                    <CheckCircle className="w-6 h-6 animate-bounce" />
                  ) : (
                    <Building className="w-6 h-6" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Step 1: Create Express Account
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Create a Stripe Express account to start receiving payments
                  from customers around the world
                </p>

                {!accountId ? (
                  <button
                    onClick={createExpressAccount}
                    disabled={loading}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    <Building className="w-5 h-5" />
                    Create Express Account
                  </button>
                ) : (
                  <div className="flex items-center text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200">
                    <CheckCircle className="w-5 h-5 mr-3 animate-pulse" />
                    <span className="font-semibold">
                      Express account created successfully
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Complete Onboarding */}
          <div className="group border border-gray-200 rounded-3xl p-8 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up-delay-2">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    accountStatus === "complete"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                      : accountId
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg group-hover:scale-110"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {accountStatus === "complete" ? (
                    <CheckCircle className="w-6 h-6 animate-bounce" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Step 2: Complete Onboarding
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Complete the Stripe onboarding process to verify your identity
                  and banking information
                </p>

                {accountId && accountStatus !== "complete" ? (
                  <button
                    onClick={generateOnboardingLink}
                    disabled={loading}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    <User className="w-5 h-5" />
                    Complete Onboarding
                  </button>
                ) : accountStatus === "complete" ? (
                  <div className="flex items-center text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200">
                    <CheckCircle className="w-5 h-5 mr-3 animate-pulse" />
                    <span className="font-semibold">
                      Onboarding completed successfully
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-500 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    Complete Step 1 first to proceed
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Ready for Payouts */}
          <div className="group border border-gray-200 rounded-3xl p-8 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up-delay-3">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    accountStatus === "complete"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg group-hover:scale-110"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Step 3: Ready for Payouts
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Once onboarding is complete, you'll be ready to receive
                  payments and manage your earnings
                </p>

                {accountStatus === "complete" ? (
                  <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl shadow-inner">
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600 mr-3 animate-bounce" />
                      <div>
                        <p className="text-emerald-800 font-bold text-lg">
                          🎉 Your account is ready to receive payouts!
                        </p>
                        <p className="text-emerald-700 mt-1">
                          You can now start selling and receiving payments
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    Complete onboarding to enable payouts
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl shadow-lg animate-shake">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 animate-pulse" />
              <p className="text-red-800 font-semibold text-lg">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl shadow-lg animate-bounce-in">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 mr-3 animate-bounce" />
              <p className="text-emerald-800 font-semibold text-lg">
                {success}
              </p>
            </div>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-slide-up-delay-1 {
          animation: slide-up 0.6s ease-out 0.1s both;
        }
        
        .animate-slide-up-delay-2 {
          animation: slide-up 0.6s ease-out 0.2s both;
        }
        
        .animate-slide-up-delay-3 {
          animation: slide-up 0.6s ease-out 0.3s both;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        `,
        }}
      />
    </div>
  );
};

export default StripeConnectOnboarding;
