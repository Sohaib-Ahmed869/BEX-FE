import React from "react";
import { AlertTriangle, Clock, User, Calendar, Mail } from "lucide-react";

const FlaggingDetails = ({ flaggingDetails }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "HIGH":
        return "text-red-600 bg-red-100 border-red-200";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "LOW":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-orange-600 bg-orange-100 border-orange-200";
      case "RESOLVED":
        return "text-green-600 bg-green-100 border-green-200";
      case "REJECTED":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle case where flaggingDetails might be empty or undefined
  if (!flaggingDetails || flaggingDetails.length === 0) {
    return (
      <div className="w-full mx-auto p-4 sm:p-6 bg-white animate-fadeIn">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-medium text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            Flagging Details
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Review flagged items and their current status
          </p>
        </div>
        <div className="text-center py-8 animate-slideUp">
          <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-base sm:text-lg">
            No flagging details found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 sm:p-6 bg-white animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-medium text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
          Flagging Details
        </h2>
      </div>

      <div className="space-y-4">
        {flaggingDetails.map((flag, index) => (
          <div
            key={flag.id}
            className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50 hover:bg-gray-100 transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-1 animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header with severity and status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200 ${getSeverityColor(
                    flag.severity_level
                  )}`}
                >
                  {flag.severity_level}
                </span>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200 ${getStatusColor(
                    flag.status
                  )}`}
                >
                  <Clock className="h-3 w-3 inline mr-1" />
                  {flag.status}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 font-mono">
                ID: {flag.id.slice(-8)}
              </span>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {flag.flagging_reason}
                  </h3>
                  {flag.description ? (
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {flag.description}
                    </p>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-500 italic">
                      No description provided
                    </p>
                  )}
                </div>

                {flag.notes && (
                  <div className="bg-white p-3 rounded border transition-all duration-200 hover:shadow-sm">
                    <h4 className="font-medium text-gray-800 mb-1 text-sm sm:text-base">
                      Notes:
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {flag.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Flagged by:</span>
                  <span className="break-words">
                    {flag.flagger?.first_name?.trim()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Flagged on:</span>
                  <span className="break-words">
                    {formatDate(flag.created_at)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded border-gray-100 transition-all duration-200 hover:shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">
                    Flagger Details
                  </h4>
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      <span className="break-words">
                        {flag.flagger?.first_name?.trim()}
                      </span>
                    </p>
                    {flag.flagger?.email && (
                      <div className="flex items-start gap-1">
                        <Mail className="h-3 w-3 flex-shrink-0 mt-0.5" />
                        <span className="font-medium">Email:</span>
                        <span className="break-all">{flag.flagger.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default FlaggingDetails;
