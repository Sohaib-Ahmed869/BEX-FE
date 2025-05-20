const Settingss = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Settings</h2>
    <p>Configure your account and system preferences.</p>
    <div className="mt-4">
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold">Account Settings</h3>
        <div className="mt-2">
          <div className="mb-2">
            <label className="block text-sm font-medium">
              Email Notifications
            </label>
            <select className="mt-1 block w-full p-2 border rounded-md">
              <option>All notifications</option>
              <option>Important only</option>
              <option>None</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Theme</label>
            <select className="mt-1 block w-full p-2 border rounded-md">
              <option>Light</option>
              <option>Dark</option>
              <option>System default</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Settingss;
