// AdminDashboardSkeletonUI.js

export const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-3 bg-gray-100 rounded w-1/4"></div>
    </div>
  </div>
);

export const SkeletonChart = ({ height = "h-64" }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className={`${height} bg-gray-100 rounded mb-4`}></div>
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ rows = 5, title = true }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="animate-pulse">
      {title && <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>}
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({
  columns = 4,
  rows = 5,
  title = "Payments",
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="space-y-3">
        {/* Table Header */}
        <div
          className={`grid grid-cols-${columns} gap-4 pb-2 border-b border-gray-100`}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={`grid grid-cols-${columns} gap-4 py-2`}>
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="h-4 bg-gray-100 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonPaymentsTable = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-3">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 pb-2 border-b border-gray-100">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        {/* Table Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 py-3 border-b border-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-100 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-100 rounded w-24"></div>
            <div className="h-4 bg-gray-100 rounded w-16"></div>
            <div className="h-6 bg-gray-100 rounded-full w-20"></div>
            <div className="h-4 bg-gray-100 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonRecentOrdersTable = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-100 rounded w-24"></div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-100 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonTopCompaniesChart = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gray-200 h-2 rounded-full"
                  style={{ width: `${60 + i * 8}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonSalesSummaryChart = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div className="h-80 bg-gray-100 rounded mb-4"></div>
      <div className="flex justify-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonDateFilter = () => (
  <div className="mb-6">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonStatsCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

// Complete Admin Dashboard Skeleton Layout
export const AdminDashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <SkeletonDateFilter />

      {/* Stats Cards Skeleton */}
      <div className="mb-8">
        <SkeletonStatsCards />
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Payments Table Skeleton */}
        <SkeletonPaymentsTable />
        {/* Average Order Chart Skeleton */}
        <SkeletonChart />
      </div>

      {/* Second Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
        {/* Recent Orders Skeleton */}
        <SkeletonRecentOrdersTable />
        {/* Top Companies Chart Skeleton */}
        <SkeletonTopCompaniesChart />
      </div>

      {/* Sales Summary Skeleton */}
      <div className="mb-8">
        <SkeletonSalesSummaryChart />
      </div>
    </div>
  </div>
);
