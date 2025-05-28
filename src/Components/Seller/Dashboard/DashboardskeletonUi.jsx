export const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-3 bg-gray-100 rounded w-1/4"></div>
    </div>
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="h-64 bg-gray-100 rounded mb-4"></div>
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ rows = 5 }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
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

export const SkeletonTable = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="space-y-3">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-100">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        {/* Table Rows */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 py-2">
            <div className="h-4 bg-gray-100 rounded"></div>
            <div className="h-4 bg-gray-100 rounded"></div>
            <div className="h-4 bg-gray-100 rounded"></div>
            <div className="h-4 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonDateFilter = () => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <div className="animate-pulse flex items-center space-x-4">
      <div className="h-10 bg-gray-200 rounded w-32"></div>
      <div className="h-4 bg-gray-200 rounded w-8"></div>
      <div className="h-10 bg-gray-200 rounded w-32"></div>
      <div className="h-10 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);
