import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./homeStyles.css";
import "../App.css";
import { useShopping } from "../context/ShoppingContext";

import Logo1 from "./images/Logo_5_1_180x.png";
import LogoGroup from "./images/Logo_5_1_180x.png";
import MomsMade from "./images/Logo_5_1_180x.png";
import Product1 from "./images/Logo_5_1_180x.png";
import Product2 from "./images/Logo_5_1_180x.png";
import Product3 from "./images/Logo_5_1_180x.png";

const Home = () => {
  const { user, logout } = useAuth();
  const { addToCart: contextAddToCart, addToWishlist: contextAddToWishlist } =
    useShopping();
  const addToCart = (product) => {
    console.log("Adding to cart:", product.name);
    contextAddToCart(product);
  };

  const addToWishlist = (product) => {
    console.log("Adding to wishlist:", product.name);
    contextAddToWishlist(product);
  };
  const products = [
    {
      id: 1,
      name: "Fortune Chakki Fresh Atta",
      price: 299,
      image: Product1,
      description: "Fried in Saffola Gold, Made with Fortune Fresh Aata",
      delivery: "5-7 working days across India",
    },
    {
      id: 2,
      name: "Mom's Made Special",
      price: 349,
      image: Product2,
      description: "In every bite, a taste of home. Sealed pack jar.",
      delivery: "5-7 working days across India",
    },
    {
      id: 3,
      name: "Nandini Pure Ghee Cookies",
      price: 399,
      image: Product3,
      description:
        "Fried in pure ghee, 80% Fortune Fresh Aata, 20% Saffola Gold",
      delivery: "5-7 working days across India",
    },
  ];

  

  return (
    <div className="homepage">
      {/* Header Banner */}
      <div className="banner">
        <img
          src={LogoGroup}
          alt="100% Refund Guarantee"
          className="banner-logo"
        />
        <div className="delivery-banner">
          <img src={Logo1} alt="All India Delivery" className="delivery-logo" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <img
          src={MomsMade}
          alt="Mom's Made by Veena Kumari"
          className="hero-image"
        />
        <h1>Homemade Delights, Delivered to Your Doorstep</h1>
      </div>

      {/* Featured Products */}
      <h2 className="section-title">Our Specialties</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">₹{product.price}</p>
            <div className="product-actions">
              <button onClick={() => addToCart(product)}>Add to Cart</button>
              <button
                onClick={() => addToWishlist(product)}
                className="wishlist-btn"
              >
                ♡ Wishlist
              </button>
            </div>
            <p className="delivery-info">{product.delivery}</p>
          </div>
        ))}
      </div>

      {/* Guarantee Section */}
      <div className="guarantee-section">
        <h2>Our Guarantees</h2>
        <div className="guarantees">
          <div className="guarantee">
            <span>✓</span>
            <p>100% Refund if you don't like the taste</p>
          </div>
          <div className="guarantee">
            <span>✓</span>
            <p>Sealed pack jars for freshness</p>
          </div>
          <div className="guarantee">
            <span>✓</span>
            <p>Made with premium ingredients</p>
          </div>
        </div>
        {user && (
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
