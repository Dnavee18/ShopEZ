import React, { useEffect, useState } from 'react';
import '../../styles/Admin.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Admin = () => {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [banners, setBanners] = useState([]);
  const [bannerUrl, setBannerUrl] = useState('');

  // useEffect(() => {
  //   if (localStorage.getItem('userType') !== 'admin') {
  //     navigate('/');
  //   }
  // }, [localStorage, navigate]);

  useEffect(() => {
    fetchCountData();
    fetchBannerData();
  }, []);

  const fetchCountData = async () => {
    const users = await axios.get('http://localhost:6001/fetch-users');
    setUserCount(users.data.length - 1);

    const products = await axios.get('http://localhost:6001/fetch-products');
    setProductCount(products.data.length);

    const orders = await axios.get('http://localhost:6001/fetch-orders');
    setOrdersCount(orders.data.length);
  };

  const fetchBannerData = async () => {
    const response = await axios.get('http://localhost:6001/fetch-banners');
    setBanners(response.data);
  };

  const updateBanner = async () => {
    if (bannerUrl) {
      await axios.post('http://localhost:6001/update-banner', { banner: bannerUrl });
      alert("Banner updated");
      setBanners([...banners, bannerUrl]);  // Update local banner state
      setBannerUrl('');  // Clear input
    }
  };

  return (
    <div className="admin-page">
      <div>
        <div className="admin-home-card">
          <h5>Total users</h5>
          <p>{userCount}</p>
          <button onClick={() => navigate('/all-users')}>View all</button>
        </div>
      </div>

      <div>
        <div className="admin-home-card">
          <h5>All Products</h5>
          <p>{productCount}</p>
          <button onClick={() => navigate('/all-products')}>View all</button>
        </div>
      </div>

      <div>
        <div className="admin-home-card">
          <h5>All Orders</h5>
          <p>{ordersCount}</p>
          <button onClick={() => navigate('/all-orders')}>View all</button>
        </div>
      </div>

      <div>
        <div className="admin-home-card">
          <h5>Add Product</h5>
          <p>(new)</p>
          <button onClick={() => navigate('/new-product')}>Add now</button>
        </div>
      </div>

      {/* Carousel for Banners */}
      <div className="admin-banner-input admin-home-card">
        <h5>Banner Carousel</h5>
        <Carousel>
          {banners.map((url, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={url}
                alt={`Banner ${index + 1}`}
                style={{ height: '300px', objectFit: 'cover' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Input to Add New Banner */}
        <div className="form-floating mt-3">
          <input
            type="text"
            className="form-control"
            id="floatingURLInput"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
          />
          <label htmlFor="floatingURLInput">Add New Banner URL</label>
        </div>
        <button onClick={updateBanner} className="mt-2">
          Add to Carousel
        </button>
      </div>
    </div>
  );
};

export default Admin;
