import React, { useState, useEffect } from 'react';
import { loadScript } from '../utils/razorpay-utils.js';
import './Cart.css'

const Cart = ({ cart = [], removeFromCart = () => {}, updateQuantity = () => {} }) => {
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debugging
  useEffect(() => {
    console.log('Cart updated:', cart);
  }, [cart]);

  const calculateTotal = () => {
    try {
      return cart.reduce((total, item) => {
        if (!item.price || !item.quantity) {
          console.warn('Invalid item in cart:', item);
          return total;
        }
        return total + (item.price * item.quantity);
      }, 0);
    } catch (err) {
      console.error('Error calculating total:', err);
      return 0;
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      const options = {
        key: 'rzp_test_YOUR_TEST_KEY', // Replace with your test key
        amount: calculateTotal() * 100,
        currency: 'INR',
        name: "Mom's Made Delights",
        description: 'Order Payment',
        image: 'https://via.placeholder.com/150', // Default placeholder
        order_id: orderId || generateOrderId(),
        handler: function(response) {
          setOrderDetails({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount: calculateTotal(),
            items: [...cart], // Create a copy of cart
            date: new Date().toLocaleString()
          });
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateOrderId = () => {
    const newOrderId = 'ORD' + Math.floor(Math.random() * 1000000);
    setOrderId(newOrderId);
    return newOrderId;
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Processing...</div>}

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => window.location.href = '/'}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>₹{item.price || 0}</p>
                  <div className="quantity-control">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Total Items: {cart.reduce((total, item) => total + (item.quantity || 0), 0)}</p>
            <p>Subtotal: ₹{calculateTotal()}</p>
            <p>Delivery: FREE</p>
            <p className="total">Total: ₹{calculateTotal()}</p>
            <button 
              onClick={handleCheckout} 
              className="checkout-btn"
              disabled={loading || cart.length === 0}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}

      {orderDetails && (
        <div className="order-confirmation">
          <h3>Order Confirmation</h3>
          <p>Order ID: {orderDetails.orderId}</p>
          <p>Payment ID: {orderDetails.paymentId}</p>
          <p>Amount Paid: ₹{orderDetails.amount}</p>
          <p>Date: {orderDetails.date}</p>
          <h4>Items Ordered:</h4>
          <ul>
            {orderDetails.items.map((item) => (
              <li key={item.id}>
                {item.name} - {item.quantity} x ₹{item.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Cart;