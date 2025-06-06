import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/pages/Home.jsx";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.jsx";
import AuthForm from "./components/AuthForm.jsx";
import { useAppContext } from "./context/AppContext.jsx";
import AllProducts from "./components/pages/AllProducts.jsx";
import ProductCategory from "./components/pages/productCategory.jsx";
import ProductDetail from "./components/pages/ProductDetail.jsx";
import Cart from "./components/pages/Cart.jsx";
import Addaddress from "./components/pages/Addaddress.jsx";
import MyOrders from "./components/pages/MyOrders.jsx";
import Contact from "./components/pages/Contact.jsx";

function App() {
  const location = useLocation(); // You forgot to define this line
  const isSellerPath = location.pathname.includes("seller");

  const { showUserLogin } = useAppContext();

  const showLayout = !isSellerPath;

  return (
    <div className="min-h-screen flex flex-col">
      {showLayout && <Navbar />}
      <Toaster position="top-center" />

      {/* 🔽 Render AuthForm here */}
      {showUserLogin && <AuthForm />}

      {!showUserLogin && (
        <>
          <main
            className={`flex-grow ${
              showLayout ? "px-6 md:px-16 lg:px-24 xl:px-32" : ""
            }`}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<AllProducts />} />
              <Route path="/products/:category" element={<ProductCategory />} />
              <Route
                path="/products/:category/:id"
                element={<ProductDetail />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/add-address" element={<Addaddress />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          {showLayout && <Footer />}
        </>
      )}
    </div>
  );
}

export default App;
