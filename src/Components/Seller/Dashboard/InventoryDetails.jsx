"use client";

import { useState, useEffect } from "react";
import { fetchProductIds } from "../../../services/SellerDashboardServices";

const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const InventoryDetails = ({ dateRange }) => {
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productIds, setProductIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const userId = localStorage.getItem("userId");

  // Function to fetch sales data for a specific product
  const fetchProductSalesData = async (productId) => {
    try {
      const queryParams = new URLSearchParams();
      if (dateRange.startDate)
        queryParams.append("startDate", dateRange.startDate);
      if (dateRange.endDate) queryParams.append("endDate", dateRange.endDate);

      const response = await fetch(
        `${URL}/api/sellerdashboard/inventory/${userId}/${productId}?${queryParams}`
      );
      const result = await response.json();

      if (result.success && result.data?.product) {
        const totalSold =
          result.data.product.initialStock - result.data.product.currentStock;
        return {
          productId,
          totalSold,
          productData: result.data,
        };
      }
      return { productId, totalSold: 0, productData: null };
    } catch (error) {
      console.error(
        `Error fetching sales data for product ${productId}:`,
        error
      );
      return { productId, totalSold: 0, productData: null };
    }
  };

  // Function to find product with highest sales
  const findProductWithHighestSales = async (products) => {
    if (products.length === 0) return null;

    try {
      // Fetch sales data for all products
      const salesPromises = products.map((product) =>
        fetchProductSalesData(product.id)
      );
      const salesResults = await Promise.all(salesPromises);

      // Find the product with highest sales
      const productWithHighestSales = salesResults.reduce((max, current) => {
        return current.totalSold > max.totalSold ? current : max;
      }, salesResults[0]);

      return productWithHighestSales;
    } catch (error) {
      console.error("Error finding product with highest sales:", error);
      return products.length > 0
        ? { productId: products[0].id, totalSold: 0, productData: null }
        : null;
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoadingProducts(true);
        const data = await fetchProductIds(userId);
        console.log("Fetched products:", data);
        setProductIds(data);

        // Find and set the product with highest sales as default
        if (data && data.length > 0) {
          const highestSalesProduct = await findProductWithHighestSales(data);
          if (highestSalesProduct) {
            setSelectedProduct(highestSalesProduct.productId);
            // If we already have the product data, set it directly to avoid another API call
            if (highestSalesProduct.productData) {
              setInventoryData(highestSalesProduct.productData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductDetails();
  }, [userId]);

  useEffect(() => {
    // Only fetch if we don't already have the data and selectedProduct is set
    if (selectedProduct && !inventoryData) {
      fetchInventoryData();
    }
  }, [selectedProduct, dateRange]);

  const fetchInventoryData = async () => {
    if (!selectedProduct) return;

    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (dateRange.startDate)
        queryParams.append("startDate", dateRange.startDate);
      if (dateRange.endDate) queryParams.append("endDate", dateRange.endDate);

      const response = await fetch(
        `${URL}/api/sellerdashboard/inventory/${userId}/${selectedProduct}?${queryParams}`
      );
      const result = await response.json();

      if (result.success) {
        setInventoryData(result.data);
      } else {
        console.error("Error fetching inventory data:", result.message);
        setInventoryData(null);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setInventoryData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);
    setInventoryData(null); // Clear current data when changing products
    if (!productId) {
      setInventoryData(null);
    }
  };

  // Helper function to format date for display
  const formatDateForTimeline = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    return { day, month };
  };

  // Helper function to generate timeline labels
  const generateTimelineLabels = (inventoryData) => {
    if (!inventoryData || inventoryData.length === 0) return [];

    const totalDays = inventoryData.length;
    const maxLabels = 5; // Maximum number of labels to show

    if (totalDays <= maxLabels) {
      // Show all dates if we have few data points
      return inventoryData.map((item) => formatDateForTimeline(item.date));
    }

    // Show evenly distributed labels
    const labels = [];
    const step = Math.floor(totalDays / (maxLabels - 1));

    for (let i = 0; i < totalDays; i += step) {
      if (labels.length < maxLabels - 1) {
        labels.push(formatDateForTimeline(inventoryData[i].date));
      }
    }

    // Always add the last date
    if (labels.length < maxLabels) {
      labels.push(formatDateForTimeline(inventoryData[totalDays - 1].date));
    }

    return labels;
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Inventory details</h3>
        <select
          className="text-sm border border-gray-300 rounded px-3 py-1"
          value={selectedProduct}
          onChange={handleProductChange}
          disabled={loadingProducts}
        >
          <option value="">
            {loadingProducts ? "Loading products..." : "Select Product"}
          </option>
          {productIds.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>
      </div>

      {loadingProducts && (
        <div className="text-center text-gray-500 py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Loading products...</p>
        </div>
      )}

      {!loadingProducts && !selectedProduct && (
        <div className="text-center text-gray-500 py-8">
          No products available or select a product to view inventory details
        </div>
      )}

      {selectedProduct && loading && (
        <div className="text-center text-gray-500 py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Loading inventory data...</p>
        </div>
      )}

      {selectedProduct && !loading && !inventoryData && (
        <div className="text-center text-gray-500 py-8">
          No inventory data available
        </div>
      )}

      {selectedProduct && !loading && inventoryData && (
        <>
          <div className="mb-6">
            {/* Product Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h4 className="font-medium text-gray-900 mb-2">
                {inventoryData.product.title}
              </h4>
              <div className="text-sm text-gray-600">
                Created:{" "}
                {new Date(inventoryData.product.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Stock Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-medium text-gray-900">
                  {inventoryData.product.initialStock}
                </div>
                <div className="text-sm text-gray-600">Initial Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium text-emerald-600">
                  {inventoryData.product.currentStock}
                </div>
                <div className="text-sm text-gray-600">Current Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium text-[#F47458]">
                  {inventoryData.product.initialStock -
                    inventoryData.product.currentStock}
                </div>
                <div className="text-sm text-gray-600">Total Sold</div>
              </div>
            </div>

            {/* Chart */}
            {inventoryData.inventoryData &&
              inventoryData.inventoryData.length > 0 && (
                <>
                  <div className="relative h-64 mb-4">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                      {(() => {
                        const maxStock = Math.max(
                          ...inventoryData.inventoryData.map((d) => d.stock)
                        );
                        const minStock = Math.min(
                          ...inventoryData.inventoryData.map((d) => d.stock)
                        );
                        const range = maxStock - minStock;
                        const step = range > 0 ? Math.ceil(range / 4) : 1;

                        return [
                          <span key="max">{maxStock}</span>,
                          <span key="75">
                            {Math.max(minStock, maxStock - step)}
                          </span>,
                          <span key="50">
                            {Math.max(minStock, maxStock - 2 * step)}
                          </span>,
                          <span key="25">
                            {Math.max(minStock, maxStock - 3 * step)}
                          </span>,
                          <span key="min">{minStock}</span>,
                        ];
                      })()}
                    </div>

                    {/* Chart area */}
                    <div className="ml-12 h-full border-l border-b border-gray-200">
                      <svg className="w-full h-full" viewBox="0 0 400 240">
                        {(() => {
                          const data = inventoryData.inventoryData;

                          // Calculate proper stock progression for min/max values
                          let runningStock = data[0]?.stock || 0;
                          const stockProgression = data.map((item, index) => {
                            if (index === 0) {
                              runningStock = item.stock;
                            } else {
                              const prevDaySales = data[index - 1].sold;
                              runningStock -= prevDaySales;
                            }
                            return runningStock;
                          });

                          const maxStock = Math.max(...stockProgression);
                          const minStock = Math.min(...stockProgression);
                          const range = maxStock - minStock || 1;

                          // Grid lines
                          const gridLines = [];
                          for (let i = 0; i <= 4; i++) {
                            const y = (i / 4) * 220 + 10;
                            gridLines.push(
                              <line
                                key={`grid-${i}`}
                                x1="0"
                                y1={y}
                                x2="400"
                                y2={y}
                                stroke="#f3f4f6"
                                strokeWidth="1"
                              />
                            );
                          }

                          // Stock line and points - calculate proper stock progression
                          runningStock = data[0]?.stock || 0;
                          const stockPoints = data.map((item, index) => {
                            const x =
                              data.length > 1
                                ? (index / (data.length - 1)) * 380 + 10
                                : 200;

                            // For the first day, use the initial stock
                            if (index === 0) {
                              runningStock = item.stock;
                            } else {
                              // For subsequent days, subtract sales from previous day
                              const prevDaySales = data[index - 1].sold;
                              runningStock -= prevDaySales;
                            }

                            const y =
                              230 - ((runningStock - minStock) / range) * 220;
                            return {
                              x,
                              y,
                              displayStock: runningStock,
                              originalStock: item.stock,
                              sold: item.sold,
                              date: item.date,
                            };
                          });

                          const stockLine = stockPoints
                            .map((point) => `${point.x},${point.y}`)
                            .join(" ");

                          return (
                            <>
                              {gridLines}

                              {/* Stock line */}
                              <polyline
                                fill="none"
                                stroke="#F47458"
                                strokeWidth="3"
                                points={stockLine}
                              />

                              {/* Stock points with sales indicators */}
                              {stockPoints.map((point, index) => (
                                <g key={index}>
                                  {/* Main stock point */}
                                  <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="5"
                                    fill="#F47458"
                                    stroke="white"
                                    strokeWidth="2"
                                    className="hover:r-6 transition-all cursor-pointer"
                                  >
                                    <title>
                                      Date:{" "}
                                      {new Date(
                                        point.date
                                      ).toLocaleDateString()}
                                      {"\n"}Stock: {point.displayStock}
                                      {point.sold > 0 &&
                                        `\nSold: ${point.sold}`}
                                    </title>
                                  </circle>

                                  {/* Sales indicator - red dot if items were sold */}
                                  {point.sold > 0 && (
                                    <>
                                      <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r="8"
                                        fill="none"
                                        stroke="#ef4444"
                                        strokeWidth="2"
                                        opacity="0.6"
                                      />
                                      <text
                                        x={point.x}
                                        y={point.y - 15}
                                        textAnchor="middle"
                                        className="text-xs fill-[#F47458] font-medium"
                                        fontSize="10"
                                      >
                                        -{point.sold}
                                      </text>
                                    </>
                                  )}
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex justify-between text-xs text-gray-500 ml-12">
                    {generateTimelineLabels(inventoryData.inventoryData).map(
                      (label, index) => (
                        <div key={index} className="text-center">
                          <div className="font-medium">{label.day}</div>
                          <div className="text-gray-400">{label.month}</div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#F47458] rounded-full"></div>
                      <span>Stock Level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-red-500 rounded-full"></div>
                      <span>Sales Activity</span>
                    </div>
                  </div>

                  {/* Daily breakdown table */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Daily Breakdown
                    </h4>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left">Date</th>
                            <th className="px-3 py-2 text-right">Stock</th>
                            <th className="px-3 py-2 text-right">Sold</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inventoryData.inventoryData.map((item, index) => {
                            // Calculate running stock for display
                            let displayStock =
                              inventoryData.inventoryData[0].stock;
                            for (let i = 0; i < index; i++) {
                              displayStock -=
                                inventoryData.inventoryData[i].sold;
                            }

                            return (
                              <tr
                                key={index}
                                className="border-t border-gray-100"
                              >
                                <td className="px-3 py-2">
                                  {new Date(item.date).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-2 text-right font-medium">
                                  {displayStock}
                                </td>
                                <td
                                  className={`px-3 py-2 text-right font-medium ${
                                    item.sold > 0
                                      ? "text-[#F47458]"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {item.sold}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryDetails;
