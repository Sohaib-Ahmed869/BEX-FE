import { useState, useEffect } from "react";
import AdminDateFilter from "./AdminDateFilter";
import AdminStatsCards from "./AdminStatsCards";
import PaymentsTable from "./paymentTable";
import AverageOrderChart from "./averageOrdersChart";
import RecentOrdersTable from "./recentOrdersTable";
import TopCompaniesChart from "./topCompaniesChart";
import SalesSummaryChart from "./SalesSummaryChart";
import CubeLoader from "../../../utils/cubeLoader";
import { AdminDashboardSkeleton } from "./AdminDashboardSkeletonUi";

const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [paymentsData, setPaymentsData] = useState(null);
  const [companiesData, setCompaniesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchAllData();
  }, [dateRange.endDate]);

  useEffect(() => {
    // Trigger mount animation after data loads
    if (!loading && dashboardData) {
      const timer = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading, dashboardData]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setMounted(false); // Reset animation state
      const queryParams = new URLSearchParams();
      if (dateRange.startDate)
        queryParams.append("startDate", dateRange.startDate);
      if (dateRange.endDate) queryParams.append("endDate", dateRange.endDate);

      // Fetch all data in parallel
      const [dashboardResponse, paymentsResponse, companiesResponse] =
        await Promise.all([
          fetch(`${URL}/api/admin/dashboard/stats?${queryParams}`),
          fetch(`${URL}/api/admin/dashboard/payments?${queryParams}`),
          fetch(`${URL}/api/admin/dashboard/companies?${queryParams}&limit=10`),
        ]);

      const [dashboardResult, paymentsResult, companiesResult] =
        await Promise.all([
          dashboardResponse.json(),
          paymentsResponse.json(),
          companiesResponse.json(),
        ]);

      if (dashboardResult.success) setDashboardData(dashboardResult.data);
      if (paymentsResult.success) setPaymentsData(paymentsResult.data);
      if (companiesResult.success) setCompaniesData(companiesResult.data);
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  if (loading) {
    return (
      <>
        <CubeLoader />
        <AdminDashboardSkeleton />
      </>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Animated slide down */}
        <div
          className={`mb-8 transform transition-all duration-700 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <AdminDateFilter onDateRangeChange={handleDateRangeChange} />
        </div>

        {/* Stats Cards - Animated with stagger */}
        <div
          className={`mb-8 transform transition-all duration-700 ease-out delay-150 ${
            mounted
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-12 opacity-0 scale-95"
          }`}
        >
          <AdminStatsCards data={dashboardData.overview} />
        </div>

        {/* Main Content Grid - Left to right slide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Payments Table - Slide from left */}
          <div
            className={`transform transition-all duration-700 ease-out delay-300 ${
              mounted
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
          >
            <PaymentsTable data={paymentsData} />
          </div>

          {/* Average Order Value Chart - Slide from right */}
          <div
            className={`transform transition-all duration-700 ease-out delay-500 ${
              mounted ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
            }`}
          >
            <AverageOrderChart data={dashboardData.analyticsData} />
          </div>
        </div>

        {/* Second Row - Fade up with bounce */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
          {/* Recent Orders - Animated fade up */}
          <div
            className={`transform transition-all duration-800 ease-out delay-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            }`}
          >
            <RecentOrdersTable orders={dashboardData.recentOrders} />
          </div>

          {/* Top Companies Chart - Scale in */}
          <div
            className={`transform transition-all duration-700 ease-out delay-900 ${
              mounted ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            <TopCompaniesChart
              companies={dashboardData.topPerformingCompanies}
            />
          </div>
        </div>

        {/* Sales Summary - Final fade in */}
        <div
          className={`mb-8 transform transition-all duration-800 ease-out delay-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <SalesSummaryChart data={dashboardData.analyticsData} />
        </div>
      </div>

      {/* Optional: Add custom animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
