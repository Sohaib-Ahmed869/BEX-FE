// import { BrowserRouter as Router } from "react-router-dom";
// import { Route, Routes } from "react-router-dom";
// import Login from "./Components/Auth/Login";
// import Signup from "./Components/Auth/Signup";
// import SideBar from "./Components/SideBar/page";
// import Dashboard from "./Components/Seller/Dashboard/page";
// import Inventory from "./Components/Seller/Inventory/page";
// import ProductList from "./Components/Seller/ProductListing/page";
// import Orders from "./Components/Seller/Orders/page";
// import Settings from "./Components/Seller/Settings/page";
// import Support from "./Components/Seller/Support/Support";
// import { Navigate } from "react-router-dom";
// import NewProduct from "./Components/Seller/ProductListing/newProduct";
// import EditProduct from "./Components/Seller/ProductListing/ProductActions/EditProduct";
// import ViewProduct from "./Components/Seller/ProductListing/ProductActions/ViewProduct";
// import Products from "./Components/Buyer/Products/page";
// import Checkout from "./Components/Buyer/Checkout/checkout";
// import ProductDetailsPage from "./Components/Buyer/Products/ProductDetails/ProductDetail";
// import AuthRedirect from "./utils/AuthRedirect";
// import TokenGuard from "./utils/ValidateTokenLife";
// import Listing from "./Components/Seller/Listing/page";
// import ListingInventoryProducts from "./Components/Seller/Listing/listingInventory";
// import AddListing from "./Components/Seller/Listing/addListing";
// import SellerOrderDetailsPage from "./Components/Seller/Orders/viewOrder";
// import BuyerProfile from "./Components/Buyer/profile/page";
// import AdminSideBar from "./Components/Admin/SideBar/page";
// import AdminDashboard from "./Components/Admin/AdminDashboard/page";
// import UserManagement from "./Components/Admin/Users/page";
// import OrdersOverviewTable from "./Components/Admin/Orders/page";
// import OrderItems from "./Components/Admin/Orders/ViewOrderItems";
// import UserInsights from "./Components/Admin/Users/userInsights";
// import AdminProductsTable from "./Components/Admin/Products/page";
// import BuyerOrderDetails from "./Components/Buyer/Orders/page";
// import CommissionManagement from "./Components/Admin/Commission/Page";
// import OrderDisputes from "./Components/Admin/Disputes/page";
// import MessagingComponent from "./Components/Messaging/page";
// import SellerOrders from "./Components/Seller/Orders/newPage";
// import SellerOrderItems from "./Components/Seller/Orders/viewOrderDetails";
// import useGlobalSocket from "./hooks/MessageSocketHook";
// import { useEffect } from "react";
// import BuyerDisputesPage from "./Components/Buyer/Disputes/page";
// import UserPermissionsDashboard from "./Components/Admin/UserPermissions/page";
// import LandingPage from "./Components/LandingPage/page";
// import NotFound from "./utils/fallbackroute404.JSX";

// const AppWithSocket = () => {
//   // Initialize global socket connection

//   useGlobalSocket();

//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/" element={<LandingPage />} />
//       {/* Auth routes */}
//       <Route
//         path="/login"
//         element={
//           <AuthRedirect>
//             <Login />
//           </AuthRedirect>
//         }
//       />
//       <Route
//         path="/signup"
//         element={
//           <AuthRedirect>
//             <Signup />
//           </AuthRedirect>
//         }
//       />
//       {/* Protected routes with SideBar as the parent layout */}
//       <Route
//         path="/seller"
//         element={
//           <TokenGuard>
//             <SideBar />
//           </TokenGuard>
//         }
//       >
//         {/* Default redirect to dashboard */}
//         <Route index element={<Navigate to="/login" replace />} />

//         {/* Seller routes */}
//         <Route path="dashboard" element={<Dashboard />} />
//         <Route path="inventory" element={<Inventory />} />
//         <Route path="product-list" element={<ProductList />} />
//         <Route path="listing" element={<Listing />} />
//         <Route path="listing/add" element={<AddListing />} />
//         <Route
//           path="listing/inventory/:listingId"
//           element={<ListingInventoryProducts />}
//         />
//         <Route
//           path="listing/addInventory/:listingId"
//           element={<NewProduct />}
//         />
//         <Route path="product-list/edit/:id" element={<EditProduct />} />
//         <Route path="product-list/view/:id" element={<ViewProduct />} />
//         <Route path="orders" element={<SellerOrders />} />
//         <Route path="orders/items/:orderId" element={<SellerOrderItems />} />
//         <Route
//           path="orders/items/view/:itemId"
//           element={<SellerOrderDetailsPage />}
//         />

//         {/* General menu routes */}
//         <Route path="chats" element={<MessagingComponent />} />
//         <Route path="settings" element={<Settings />} />
//         <Route path="support" element={<Support />} />
//       </Route>
//       {/* Buyer routes */}
//       <Route
//         path="/products"
//         element={
//           <TokenGuard>
//             <Products />
//           </TokenGuard>
//         }
//       />
//       <Route
//         path="/products/:productId"
//         element={
//           <TokenGuard>
//             <ProductDetailsPage />
//           </TokenGuard>
//         }
//       />
//       <Route
//         path="/products/checkout"
//         element={
//           <TokenGuard>
//             <Checkout />
//           </TokenGuard>
//         }
//       />
//       <Route
//         path="/profile"
//         element={
//           <TokenGuard>
//             <BuyerProfile />
//           </TokenGuard>
//         }
//       />
//       <Route
//         path="/myorders"
//         element={
//           <TokenGuard>
//             <BuyerOrderDetails />
//           </TokenGuard>
//         }
//       />
//       <Route
//         path="/user/chats"
//         element={
//           <TokenGuard>
//             <MessagingComponent />
//           </TokenGuard>
//         }
//       />
//       <Route
//         path="/orderDisputes"
//         element={
//           <TokenGuard>
//             <BuyerDisputesPage />
//           </TokenGuard>
//         }
//       />

//       {/* Admin Routes */}
//       <Route
//         path="/admin"
//         element={
//           <TokenGuard>
//             <AdminSideBar />
//           </TokenGuard>
//         }
//       >
//         {/* Default redirect to dashboard */}
//         <Route index element={<Navigate to="/login" replace />} />

//         {/* Admin routes */}
//         <Route path="dashboard" element={<AdminDashboard />} />
//         <Route path="users" element={<UserManagement />} />
//         <Route path="users/insights/:userId" element={<UserInsights />} />
//         <Route path="orders" element={<OrdersOverviewTable />} />
//         <Route path="orders/orderItems/:orderId" element={<OrderItems />} />
//         <Route path="products" element={<AdminProductsTable />} />
//         <Route path="products/view/:id" element={<ViewProduct />} />
//         <Route path="commission" element={<CommissionManagement />} />
//         <Route path="disputes" element={<OrderDisputes />} />
//         <Route path="settings" element={<UserPermissionsDashboard />} />
//       </Route>
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <AppWithSocket />
//     </Router>
//   );
// };

// export default App;
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import AuthRedirect from "./utils/AuthRedirect";
import TokenGuard from "./utils/ValidateTokenLife";
import useGlobalSocket from "./hooks/MessageSocketHook";

// Loading component for lazy loading fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#f47458]"></div>
  </div>
);

// Lazy load all components
const Login = lazy(() => import("./Components/Auth/Login"));
const Signup = lazy(() => import("./Components/Auth/Signup"));
const SideBar = lazy(() => import("./Components/SideBar/page"));
const Dashboard = lazy(() => import("./Components/Seller/Dashboard/page"));
const Inventory = lazy(() => import("./Components/Seller/Inventory/page"));
const ProductList = lazy(() =>
  import("./Components/Seller/ProductListing/page")
);
const Orders = lazy(() => import("./Components/Seller/Orders/page"));
const Settings = lazy(() => import("./Components/Seller/Settings/page"));
const Support = lazy(() => import("./Components/Seller/Support/Support"));
const NewProduct = lazy(() =>
  import("./Components/Seller/ProductListing/newProduct")
);
const EditProduct = lazy(() =>
  import("./Components/Seller/ProductListing/ProductActions/EditProduct")
);
const ViewProduct = lazy(() =>
  import("./Components/Seller/ProductListing/ProductActions/ViewProduct")
);
const Products = lazy(() => import("./Components/Buyer/Products/page"));
const Checkout = lazy(() => import("./Components/Buyer/Checkout/checkout"));
const ProductDetailsPage = lazy(() =>
  import("./Components/Buyer/Products/ProductDetails/ProductDetail")
);
const Listing = lazy(() => import("./Components/Seller/Listing/page"));
const ListingInventoryProducts = lazy(() =>
  import("./Components/Seller/Listing/listingInventory")
);
const AddListing = lazy(() => import("./Components/Seller/Listing/addListing"));
const SellerOrderDetailsPage = lazy(() =>
  import("./Components/Seller/Orders/viewOrder")
);
const BuyerProfile = lazy(() => import("./Components/Buyer/profile/page"));
const AdminSideBar = lazy(() => import("./Components/Admin/SideBar/page"));
const AdminDashboard = lazy(() =>
  import("./Components/Admin/AdminDashboard/page")
);
const UserManagement = lazy(() => import("./Components/Admin/Users/page"));
const OrdersOverviewTable = lazy(() =>
  import("./Components/Admin/Orders/page")
);
const OrderItems = lazy(() =>
  import("./Components/Admin/Orders/ViewOrderItems")
);
const UserInsights = lazy(() =>
  import("./Components/Admin/Users/userInsights")
);
const AdminProductsTable = lazy(() =>
  import("./Components/Admin/Products/page")
);
const BuyerOrderDetails = lazy(() => import("./Components/Buyer/Orders/page"));
const CommissionManagement = lazy(() =>
  import("./Components/Admin/Commission/Page")
);
const OrderDisputes = lazy(() => import("./Components/Admin/Disputes/page"));
const MessagingComponent = lazy(() => import("./Components/Messaging/page"));
const SellerOrders = lazy(() => import("./Components/Seller/Orders/newPage"));
const SellerOrderItems = lazy(() =>
  import("./Components/Seller/Orders/viewOrderDetails")
);
const BuyerDisputesPage = lazy(() =>
  import("./Components/Buyer/Disputes/page")
);
const UserPermissionsDashboard = lazy(() =>
  import("./Components/Admin/UserPermissions/page")
);
const LandingPage = lazy(() => import("./Components/LandingPage/page"));
const NotFound = lazy(() => import("./utils/fallbackroute404"));

const AppWithSocket = () => {
  // Initialize global socket connection
  useGlobalSocket();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRedirect>
              <Signup />
            </AuthRedirect>
          }
        />

        {/* Protected routes with SideBar as the parent layout */}
        <Route
          path="/seller"
          element={
            <TokenGuard>
              <SideBar />
            </TokenGuard>
          }
        >
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="/login" replace />} />

          {/* Seller routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="product-list" element={<ProductList />} />
          <Route path="listing" element={<Listing />} />
          <Route path="listing/add" element={<AddListing />} />
          <Route
            path="listing/inventory/:listingId"
            element={<ListingInventoryProducts />}
          />
          <Route
            path="listing/addInventory/:listingId"
            element={<NewProduct />}
          />
          <Route path="product-list/edit/:id" element={<EditProduct />} />
          <Route path="product-list/view/:id" element={<ViewProduct />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="orders/items/:orderId" element={<SellerOrderItems />} />
          <Route
            path="orders/items/view/:itemId"
            element={<SellerOrderDetailsPage />}
          />

          {/* General menu routes */}
          <Route path="chats" element={<MessagingComponent />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Buyer routes */}
        <Route
          path="/products"
          element={
            <TokenGuard>
              <Products />
            </TokenGuard>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <TokenGuard>
              <ProductDetailsPage />
            </TokenGuard>
          }
        />
        <Route
          path="/products/checkout"
          element={
            <TokenGuard>
              <Checkout />
            </TokenGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <TokenGuard>
              <BuyerProfile />
            </TokenGuard>
          }
        />
        <Route
          path="/myorders"
          element={
            <TokenGuard>
              <BuyerOrderDetails />
            </TokenGuard>
          }
        />
        <Route
          path="/user/chats"
          element={
            <TokenGuard>
              <MessagingComponent />
            </TokenGuard>
          }
        />
        <Route
          path="/orderDisputes"
          element={
            <TokenGuard>
              <BuyerDisputesPage />
            </TokenGuard>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <TokenGuard>
              <AdminSideBar />
            </TokenGuard>
          }
        >
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="/login" replace />} />

          {/* Admin routes */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/insights/:userId" element={<UserInsights />} />
          <Route path="orders" element={<OrdersOverviewTable />} />
          <Route path="orders/orderItems/:orderId" element={<OrderItems />} />
          <Route path="products" element={<AdminProductsTable />} />
          <Route path="products/view/:id" element={<ViewProduct />} />
          <Route path="commission" element={<CommissionManagement />} />
          <Route path="disputes" element={<OrderDisputes />} />
          <Route path="settings" element={<UserPermissionsDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <AppWithSocket />
    </Router>
  );
};

export default App;
