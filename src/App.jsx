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
          <Route path="orders" element={<Orders />} />
          <Route
            path="orders/details/:itemId"
            element={<SellerOrderDetailsPage />}
          />

          {/* General menu routes */}
          <Route path="messages" element={<Messages />} />
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
      </Routes>
    </Router>
  );
};

export default App;
