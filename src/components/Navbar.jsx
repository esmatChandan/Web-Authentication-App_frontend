import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import './Navbar.css';
import { FaShoppingCart, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import logo from '../pages/images/Shopify_1080x1080_8_180x.png'

const Navbar = ({ cartCount, wishlistCount }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.navbar') && !e.target.closest('.mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src={logo} alt="Mom's Made" />
          </Link>
       
          {/* Desktop Navigation */}
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/cart" className="cart-link">
              <FaShoppingCart /> Cart
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            <Link to="/wishlist" className="wishlist-link">
              Wishlist {wishlistCount > 0 && <span>({wishlistCount})</span>}
            </Link>
            {user ? (
              <button onClick={handleLogout} className="auth-link">
                <FaUser /> Logout
              </button>
            ) : (
              <Link to="/auth" className="auth-link">
                <FaUser /> Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
            <FaShoppingCart /> Cart {cartCount > 0 && <span>({cartCount})</span>}
          </Link>
          <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
            Wishlist {wishlistCount > 0 && <span>({wishlistCount})</span>}
          </Link>
          {user ? (
            <button onClick={handleLogout} className="auth-link">
              <FaUser /> Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className="auth-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaUser /> Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;