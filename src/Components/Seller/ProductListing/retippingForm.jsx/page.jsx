import { useState } from "react";

export const RetippingConfiguration = ({ formData, onChange }) => {
  const [retippingData, setRetippingData] = useState({
    diameter: formData.retipping?.diameter || '3"',
    segments: formData.retipping?.segments || "6",
    perSegmentPrice: formData.retipping?.perSegmentPrice || "14.00",
    totalPrice: formData.retipping?.totalPrice || "84.00",
    enableDIY: formData.retipping?.enableDIY || false,
  });

  useEffect(() => {
    // Calculate total price whenever segments or per segment price changes
    const segments = parseInt(retippingData.segments) || 0;
    const perSegmentPrice = parseFloat(retippingData.perSegmentPrice) || 0;
    const totalPrice = (segments * perSegmentPrice).toFixed(2);

    setRetippingData((prev) => ({
      ...prev,
      totalPrice,
    }));

    onChange({ retipping: { ...retippingData, totalPrice } });
  }, [retippingData.segments, retippingData.perSegmentPrice, onChange]);

  const handleInputChange = (field, value) => {
    setRetippingData({
      ...retippingData,
      [field]: value,
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Retipping Configuration</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Diameter (inches)
        </label>
        <div className="relative">
          <select
            value={retippingData.diameter}
            onChange={(e) => handleInputChange("diameter", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md appearance-none"
          >
            <option>2\"</option>
            <option>3\"</option>
            <option>4\"</option>
            <option>5\"</option>
            <option>6\"</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Segments
        </label>
        <input
          type="number"
          value={retippingData.segments}
          onChange={(e) => handleInputChange("segments", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Retipping Price Summary:
          </label>
          <div className="flex justify-between mb-2">
            <span>Per segment price:</span>
            <span>${retippingData.perSegmentPrice}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total retipping price:</span>
            <span>${retippingData.totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={retippingData.enableDIY}
            onChange={(e) => handleInputChange("enableDIY", e.target.checked)}
            className="mr-2"
          />
          Enable DIY segment purchasing option
        </label>
        <p className="text-xs text-gray-500 ml-6">
          Allow customers to purchase individual segments for DIY retipping
        </p>
      </div>
    </div>
  );
};
