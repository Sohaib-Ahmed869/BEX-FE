import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import SideBar from "./Components/SideBar/page";
import Dashboard from "./Components/Seller/Dashboard/page";
import Inventory from "./Components/Seller/Inventory/page";
import ProductList from "./Components/Seller/ProductListing/page";
import Orders from "./Components/Seller/Orders/page";
import Messages from "./Components/Seller/Messages/pages";
import Settings from "./Components/Seller/Settings/page";
import Support from "./Components/Seller/Support/Support";
import { Navigate } from "react-router-dom";
import NewProduct from "./Components/Seller/ProductListing/newProduct";
import EditProduct from "./Components/Seller/ProductListing/ProductActions/EditProduct";
import ViewProduct from "./Components/Seller/ProductListing/ProductActions/ViewProduct";
import Products from "./Components/Buyer/Products/page";
import Checkout from "./Components/Buyer/Checkout/checkout";
import ProductDetailsPage from "./Components/Buyer/Products/ProductDetails/ProductDetail";
import AuthRedirect from "./utils/AuthRedirect";
import TokenGuard from "./utils/ValidateTokenLife";
import Listing from "./Components/Seller/Listing/page";
import ListingInventoryProducts from "./Components/Seller/Listing/listingInventory";
import AddListing from "./Components/Seller/Listing/addListing";
import SellerOrderDetailsPage from "./Components/Seller/Orders/viewOrder";
import BuyerProfile from "./Components/Buyer/profile/page";
import AdminSideBar from "./Components/Admin/SideBar/page";
import AdminDashboard from "./Components/Admin/AdminDashboard/page";
import UserManagement from "./Components/Admin/Users/page";
import OrdersOverviewTable from "./Components/Admin/Orders/page";
import OrderItems from "./Components/Admin/Orders/ViewOrderItems";
import UserInsights from "./Components/Admin/Users/userInsights";
import AdminProductsTable from "./Components/Admin/Products/page";
import BuyerOrderDetails from "./Components/Buyer/Orders/page";
import CommissionManagement from "./Components/Admin/Commission/Page";
import OrderDisputes from "./Components/Admin/Disputes/page";
import MessagingComponent from "./Components/Messaging/page";
import SellerOrders from "./Components/Seller/Orders/newPage";
import SellerOrderItems from "./Components/Seller/Orders/viewOrderDetails";
const App = () => {
  return (
    <Router>
      <Routes>
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
          path="/"
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
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
