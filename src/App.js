import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./App.css";
import AuthFlow from "./components/Auth/AuthFlow";
import Home from "./pages/Home";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Cart from "../src/pages/Cart.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Wishlist from "../src/pages/Wishlist.jsx";
import Navbar from "../src/components/Navbar.jsx";
import { ShoppingProvider } from "./context/ShoppingContext.js";

export default function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // const addToWishlist = (product) => {
  //   setWishlist((prevWishlist) => {
  //     if (!prevWishlist.find((item) => item.id === product.id)) {
  //       return [...prevWishlist, product];
  //     }
  //     return prevWishlist;
  //   });
  // };

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    );
  };

  return (
    <ShoppingProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar cartCount={cart.length} wishlistCount={wishlist.length} />
            <Routes>
              <Route path="/auth" element={<AuthFlow />} />

              {/* ✅ Fixed PrivateRoute closing tag */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute> // ✅ Properly closed
                }
              />

              <Route
                path="/cart"
                element={
                  <Cart
                    cart={cart}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                  />
                }
              />
              <Route
                path="/wishlist"
                element={
                  <Wishlist
                    wishlist={wishlist}
                    removeFromWishlist={removeFromWishlist}
                    addToCart={addToCart}
                  />
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ShoppingProvider>
  );
}
