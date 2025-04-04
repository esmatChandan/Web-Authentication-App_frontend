import React from 'react';
import { FaTrash, FaCartPlus } from 'react-icons/fa';
import './Wishlist.css';

const Wishlist = ({ wishlist = [], removeFromWishlist = () => {}, addToCart = () => {} }) => {
  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h2 className="wishlist-header">Your Wishlist</h2>
        
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <p>Your wishlist is empty</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => window.location.href = '/'}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                <div className="wishlist-image-container">
                  <img 
                    src={item.image || '/images/placeholder-product.jpg'} 
                    alt={item.name} 
                    className="wishlist-image"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg';
                    }}
                  />
                </div>
                
                <div className="wishlist-details">
                  <h3 className="wishlist-item-name">{item.name}</h3>
                  <p className="wishlist-item-price">₹{item.price?.toLocaleString() || '0'}</p>
                  
                  <div className="wishlist-actions">
                    <button 
                      onClick={() => addToCart(item)}
                      className="add-to-cart-btn"
                    >
                      <FaCartPlus /> Add to Cart
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="remove-item-btn"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;