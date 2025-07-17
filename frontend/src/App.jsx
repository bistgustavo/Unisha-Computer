import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./components/pages/Home.jsx";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.jsx";
import { useAppContext } from "./context/AppContext.jsx";
import AllProducts from "./components/pages/AllProducts.jsx";
import ProductCategory from "./components/pages/productCategory.jsx";
import ProductDetail from "./components/pages/ProductDetail.jsx";
import Cart from "./components/pages/Cart.jsx";
import Addaddress from "./components/pages/Addaddress.jsx";
import MyOrders from "./components/pages/MyOrders.jsx";
import Contact from "./components/pages/Contact.jsx";
import SellerLayout from "./components/pages/seller/SellerLayout.jsx";
import AddProduct from "./components/Seller/AddProduct.jsx";
import ProductList from "./components/Seller/ProductList.jsx";
import Order from "./components/Seller/Order.jsx";
import Login from "./components/Login.jsx";
import SignupForm from "./components/Signup.jsx";
import Profile from "./components/pages/Profile.jsx";

function App() {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const { isSeller } = useAppContext();
  const showLayout = !isSellerPath;

  return (
    <div className="min-h-screen flex flex-col">
      {showLayout && <Navbar />}
      <Toaster position="top-center" />

      <main
        className={`flex-grow ${
          showLayout ? "px-6 md:px-16 lg:px-24 xl:px-32" : ""
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<Addaddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          {/* Protected Seller Routes */}
          <Route
            path="/seller"
            element={isSeller ? <SellerLayout /> : <Navigate to="/" replace />}
          >
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Order />} />
          </Route>
        </Routes>
      </main>
      {showLayout && <Footer />}
    </div>
  );
}

export default App;
