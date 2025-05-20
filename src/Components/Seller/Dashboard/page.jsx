const Dashboard = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    <p>
      Welcome to your dashboard! Here you can see an overview of your business.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold">Today's Sales</h3>
        <p className="text-2xl font-bold mt-2">$1,245</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold">Pending Orders</h3>
        <p className="text-2xl font-bold mt-2">8</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
