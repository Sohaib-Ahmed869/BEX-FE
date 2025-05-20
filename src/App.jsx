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

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes with SideBar as the parent layout */}
        <Route path="/" element={<SideBar />}>
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="/product-list" replace />} />

          {/* Main menu routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="product-list" element={<ProductList />} />
          <Route path="product-list/new" element={<NewProduct />} />
          <Route path="product-list/edit/:id" element={<EditProduct />} />
          <Route path="product-list/view/:id" element={<ViewProduct />} />
          <Route path="orders" element={<Orders />} />

          {/* General menu routes */}
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
        </Route>
        <Route path="/products" element={<Products />} />

        {/* Catch all - redirect to dashboard */}
        {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
