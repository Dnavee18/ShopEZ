import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FlashSale.css';


const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId('1');  // Ensure a valid 24-byte hex string or integer.

const FlashSale = () => {
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const navigate = useNavigate();

  // Hardcoded flash sale products
  const staticFlashSaleProducts = [
    {
      _id: '1',
      image: 'https://5.imimg.com/data5/SELLER/Default/2023/7/323363820/XA/ZE/KR/192140499/lightweight-trendy-casual-shoes-for-men-1000x1000.png',
      name: 'Casual Shoes',
      description: "The Hill men's casual shoes, made from synthetic foam, are perfect for daily wear.",
      discount: 10,
    },
    {
      _id: '2',
      image: 'https://m.media-amazon.com/images/I/51HfMuLeTmL._SY695_.jpg',
      name: 'Women Heels',
      description: 'Classic style with a block heel, ankle strap, buckle closure, made of resin, manufactured in India.',
      discount: 25,
    },
    {
      _id: '3',
      image: 'https://m.media-amazon.com/images/I/71NbkTQGTML.SY625.jpg',
      name: 'Rose Gold Plated Bracelet',
      description: 'A stylish alloy bracelet with rose gold plating, adorned with Austrian crystals, adjustable for up to 6 cm.',
      discount: 92,
    },
    {
      _id: '4',
      image: 'https://m.media-amazon.com/images/I/510LZJBmcxL._SY741_.jpg',
      name: 'Solid Shirt',
      description: 'Polyester shirt with textured pattern, half sleeves, and spread collar, made in India.',
      discount: 74,
    },
    {
      _id: '5',
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/bed/j/q/r/double-199-39-na-no-154-94-particle-board-no-68-75x60-nirvana-original-imah4w4vug76fkhu.jpeg?q=70&crop=false',
      name: 'Engineered Wood Queen Bed',
      description: 'Queen-sized bed made from particle board, knock-down condition, 1-year warranty, flexible payment options.',
      discount: 62,
    },
    {
      _id: '6',
      image: 'https://rukminim2.flixcart.com/image/128/128/xif0q/smart-lighting/k/i/i/10-rgb-led-crystal-diamond-night-light-16-color-changing-lights-original-imahfkbqasppqq9a.jpeg?q=70&crop=false',
      name: 'Crystal Diamond Night Light',
      description: 'Crystal table lamp with geometric-cut design and adjustable LED lighting in three color temperatures.',
      discount: 60,
    },
  ];

  // Fetch flash sale products from the backend
  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        const response = await axios.get('http://localhost:6001/fetch-products');
        setFlashSaleProducts(response.data);
      } catch (error) {
        console.error('Error fetching flash sale products:', error);
      }
    };

    fetchFlashSaleProducts();
  }, []);

  // Handler to open the product page in a new tab
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to the product details page
  };

  // Combine static and fetched products
  const combinedFlashSaleProducts = [...staticFlashSaleProducts, ...flashSaleProducts];

  return (
    <div className="flashSaleContainer">
      <h3>Flash Sale</h3>
      <div className="flashSale-body">
        {combinedFlashSaleProducts.map((product) => (
          <div key={product._id} className="flashSaleCard">
            <img src={product.image} alt={product.name} />
            <div
              className="flashSaleCard-data"
              onClick={() => handleProductClick(product._id)}
              role="button" // Accessibility improvement for clickable div
              tabIndex = {product._id}  // Valid 24-character hex ObjectId// Accessibility improvement for keyboard navigation
            >
              <h6>{product.name}</h6>
              <p>{product.description}</p>
              <h5>{product.discount}% off</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
