const Orders = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Orders</h2>
    <p>Manage and process your customer orders.</p>
    <div className="mt-4">
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h3 className="text-lg font-semibold">Order #1234</h3>
        <p className="mt-2">Customer: John Doe</p>
        <p>Status: Processing</p>
        <p>Total: $85.99</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold">Order #1235</h3>
        <p className="mt-2">Customer: Jane Smith</p>
        <p>Status: Shipped</p>
        <p>Total: $129.50</p>
      </div>
    </div>
  </div>
);
export default Orders;
