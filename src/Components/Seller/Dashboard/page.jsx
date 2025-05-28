"use client";

import { useState, useEffect } from "react";
import DateFilter from "./DateFilter";
import StatsCards from "./StatsCards";
import RecentOrders from "./RecentOrders";
import SalesChart from "./SalesChart";
import TopSellingProducts from "./topSellingProducts";
import InventoryDetails from "./InventoryDetails";
import CubeLoader from "../../../utils/cubeLoader";
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonDateFilter,
  SkeletonList,
  SkeletonTable,
} from "./DashboardskeletonUi";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchDashboardData();
  }, [userId, dateRange.endDate]);

  // Trigger animations after data loads
  useEffect(() => {
    if (!loading && dashboardData) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, dashboardData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setIsVisible(false); // Hide content during reload
      const queryParams = new URLSearchParams();
      if (dateRange.startDate)
        queryParams.append("startDate", dateRange.startDate);
      if (dateRange.endDate) queryParams.append("endDate", dateRange.endDate);

      const response = await fetch(
        `${URL}/api/sellerdashboard/stats/${userId}?${queryParams}`
      );
      const result = await response.json();
      console.log("Dashboard data:", result);

      if (result.success) {
        setDashboardData(result.data);
      } else {
        console.error("Error fetching dashboard data:", result.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
  };

  if (loading) {
    return (
      <>
        <CubeLoader />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8">
              <SkeletonDateFilter />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>

            {/* Main Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Sales Chart Skeleton */}
              <div className="lg:col-span-2">
                <SkeletonChart />
              </div>

              {/* Top Selling Products Skeleton */}
              <div>
                <SkeletonList rows={3} />
              </div>
            </div>

            {/* Bottom Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders Skeleton */}
              <div>
                <SkeletonTable />
              </div>

              {/* Inventory Details Skeleton */}
              <div>
                <SkeletonList rows={4} />
              </div>
            </div>
          </div>
        </div>
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
      <div className="max-w-full   lg:mx-10 md:mx-10">
        {/* Header */}
        <div
          className={`mb-8 transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <DateFilter onDateRangeChange={handleDateRangeChange} />
        </div>

        {/* Stats Cards */}
        <div
          className={`mb-8 transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <StatsCards data={dashboardData} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Sales Chart */}
          <div
            className={`lg:col-span-2 transform transition-all duration-700 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <SalesChart data={dashboardData.salesData} />
          </div>

          {/* Top Selling Products */}
          <div
            className={`transform transition-all duration-700 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <TopSellingProducts
              products={dashboardData.topSellingProducts}
              onProductSelect={handleProductSelect}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div
            className={`transform transition-all duration-700 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <RecentOrders orders={dashboardData.recentOrders} />
          </div>

          {/* Inventory Details */}
          <div
            className={`transform transition-all duration-700 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <InventoryDetails dateRange={dateRange} />
          </div>
        </div>
      </div>

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
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
