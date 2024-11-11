import React, { useContext, useEffect, useState } from 'react';
import { BsCart3, BsPersonCircle } from 'react-icons/bs';
import { FcSearch } from 'react-icons/fc';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';
import { ImCancelCircle } from 'react-icons/im';
import axios from 'axios';

const Navbar = () => {

  const navigate = useNavigate();
  const usertype = localStorage.getItem('userType');
  const username = localStorage.getItem('username');
  const { cartCount, logout } = useContext(GeneralContext);

  const [productSearch, setProductSearch] = useState('');
  const [noResult, setNoResult] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const categoryResponse = await axios.get('http://localhost:6001/fetch-categories');
      setCategories(categoryResponse.data);

      // Fetch all products
      const productResponse = await axios.get('http://localhost:6001/fetch-products');
      setProducts(productResponse.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleSearch = () => {
    // Check if search term matches any category
    if (categories.map(category => category.toLowerCase()).includes(productSearch.toLowerCase())) {
      navigate(`/category/${productSearch}`);
    } else {
      // Check if search term matches any product name or description
      const foundProduct = products.find(product =>
        product.title.toLowerCase().includes(productSearch.toLowerCase()) || 
        product.description.toLowerCase().includes(productSearch.toLowerCase())
      );

      if (foundProduct) {
        navigate(`/product/${foundProduct._id}`); // Navigate to product detail page
      } else {
        setNoResult(true);
      }
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {/* user navbar */}
      {!usertype ? (
        <div className="navbar">
          <h3 onClick={() => navigate('')}>ShopEZ</h3>

          <div className="nav-content">
            <div className="nav-search">
              <input
                type="text"
                name="nav-search"
                id="nav-search"
                placeholder="Search Electronics, Fashion, Mobiles, etc."
                onChange={(e) => setProductSearch(e.target.value)}
                onKeyPress={handleKeyPress} // Listen for Enter key press
              />
              <FcSearch className="nav-search-icon" onClick={handleSearch} />
              {noResult && (
                <div className="search-result-data">
                  no items found... try searching for Electronics, Mobiles, Groceries, etc.
                  <ImCancelCircle className="search-result-data-close-btn" onClick={() => setNoResult(false)} />
                </div>
              )}
            </div>

            <button className="btn" onClick={() => navigate('/auth')}>Login</button>
          </div>
        </div>
      ) : (
        <>
          {usertype === 'customer' ? (
            <div className="navbar">
              <h3 onClick={() => navigate('')}>ShopEZ</h3>
              <li onClick={() => navigate('/Recommendations')}>Recommendations</li>
              <div className="nav-content">
                <div className="nav-search">
                  <input
                    type="text"
                    name="nav-search"
                    id="nav-search"
                    placeholder="Search Electronics, Fashion, Mobiles, etc."
                    onChange={(e) => setProductSearch(e.target.value)}
                    onKeyPress={handleKeyPress} // Listen for Enter key press
                  />
                  <FcSearch className="nav-search-icon" onClick={handleSearch} />
                  {noResult && (
                    <div className="search-result-data">
                      no items found... try searching for Electronics, Mobiles, Groceries, etc.
                      <ImCancelCircle className="search-result-data-close-btn" onClick={() => setNoResult(false)} />
                    </div>
                  )}
                </div>

                <div className="nav-content-icons">
                  <div className="nav-profile" onClick={() => navigate('/profile')}>
                    <BsPersonCircle className="navbar-icons" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Profile" />
                    <p>{username}</p>
                  </div>
                  <div className="nav-cart" onClick={() => navigate('/cart')}>
                    <BsCart3 className="navbar-icons" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Cart" />
                    <div className="cart-count">{cartCount}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="navbar-admin">
              <h3 onClick={() => navigate('/admin')}>ShopEZ (admin)</h3>
              <ul>
                <li onClick={() => navigate('/admin')}>Home</li>
                <li onClick={() => navigate('/all-users')}>Users</li>
                <li onClick={() => navigate('/all-orders')}>Orders</li>
                <li onClick={() => navigate('/all-products')}>Products</li>
                <li onClick={() => navigate('/new-product')}>New Product</li>
                <li onClick={() => navigate('/SellerDashboard')}>Seller Dashboard</li>
                <li onClick={logout}>Logout</li>
              </ul>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Navbar;
