"use client";

const TopSellingProducts = ({ products, onProductSelect }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Selling Product</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            View all
          </button>
        </div>
        <div className="text-center text-gray-500 py-8">
          No products sold yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Top Selling Product</h3>
        {/* <button className="text-sm text-blue-600 hover:text-blue-800">
          View all
        </button> */}
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onProductSelect(product.id)}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
              {product.image ? (
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {product.title}
              </h4>
              <p className="text-xs text-gray-500">{product.totalSold} sold</p>
            </div>

            <div className="text-right">
              <div className="flex items-center text-xs text-green-600 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Available
              </div>
              <p className="text-xs text-gray-500">
                {product.stockRemaining} Stocks Remaining
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
