import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Home.css';
import Products from '../components/Products';
import Footer from '../components/Footer';
import FlashSale from '../components/FlashSale';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Fetch banner images from the backend
  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-banners');
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error.response ? error.response.data : error.message);
    }
  };

  const nextBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  return (
    <div className="HomePage">
      {/* Banner Section - Carousel */}
      <div className="home-banner">
        {banners.length > 0 ? (
          <div className="banner-carousel" style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}>
            {banners.map((banner, index) => (
              <img key={index} src={banner} alt={`Home Banner ${index + 1}`} />
            ))}
          </div>
        ) : (
          <div className="banner-carousel" style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}>
            <img src="/images/home-banner-1.png" alt=" " />
            <img src="/images/home-banner-2.png" alt="Default Banner 2" />
          </div>
        )}
      </div>

      {/* Carousel Controls */}
      {(banners.length > 1 || banners.length === 0) && (
        <div className="carousel-controls">
          <button onClick={prevBanner}>❮</button>
          <button onClick={nextBanner}>❯</button>
        </div>
      )}

      {/* FlashSale Section */}
      <FlashSale />

      {/* Category Cards */}
      <div className="home-categories-container">
        {/* Category Cards will be displayed here */}
      </div>

      {/* Products Section */}
      <div id="products-body"></div>
      <Products category="all" />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
