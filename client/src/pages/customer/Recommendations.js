import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = ({ userId }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        // Fetch recommendations from backend
        const response = await axios.get(`/recommendations/${userId}`);
        
        if (response.data) {
          setRecommendedProducts(response.data);
        } else {
          setRecommendedProducts([]);
        }
      } catch (error) {
        console.error("Error fetching recommended products:", error);
        setError("Could not load recommended products.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecommendedProducts();
    }
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recommendations">
      <h2>Recommended For You</h2>
      {recommendedProducts.length === 0 ? (
        <p>No recommendations available.</p>
      ) : (
        <div className="products">
          {recommendedProducts.map((product) => (
            <div key={product._id} className="product">
              {/* Assuming each product has a title, price, and image */}
              <img
                src={product.mainImg || '/default-image.jpg'} // Replace with actual image field
                alt={product.title}
                style={{ width: '200px', height: '200px' }} // You can adjust the style
              />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
