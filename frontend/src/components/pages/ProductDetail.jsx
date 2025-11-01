import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import ProductCard from "../ProductCard";
import StarRating from "../StarRating";
import ReviewModal from "../ReviewModal";
import { addItemToCart } from "../../services/cartService";
import { getProductRatingSummary, getProductReviews } from "../../services/reviewService";
import toast from "react-hot-toast";

function ProductDetail() {
  const {
    apiProduct,
    navigate,
    currency,
    addToCart,
    refreshCart,
    cart,
    setCart,
    userData,
    user,
  } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({ average_rating: 0, total_reviews: 0 });
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const product = apiProduct.find((item) => item.product_id === id);

  // Fetch rating summary and reviews
  const fetchReviewData = async () => {
    if (!product?.product_id) return;
    
    try {
      setReviewsLoading(true);
      const [summary, reviewsList] = await Promise.all([
        getProductRatingSummary(product.product_id),
        getProductReviews(product.product_id)
      ]);
      setRatingSummary(summary);
      setReviews(reviewsList);
    } catch (error) {
      console.error("Error fetching review data:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // handle add to cart
  const handleAddToCart = async (e) => {
    e?.stopPropagation();
    try {
      const result = await addItemToCart(cart.cart_id, product.product_id, 1);
      setCart(result);
      toast.success("Added to cart!");
      await refreshCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add to cart");
    }
  };

  useEffect(() => {
    if (apiProduct.length > 0) {
      let productCopy = apiProduct.slice();
      productCopy = productCopy.filter(
        (item) => item.category.name === product.category.name
      );
      setRelatedProducts(productCopy.slice(0, 5));
    }
  }, [apiProduct]);

  useEffect(() => {
    if (
      product?.image_url1 ||
      product?.image_url2 ||
      product?.image_url3 ||
      product?.image_url4
    ) {
      setThumbnail(
        product.image_url1 ||
          product.image_url2 ||
          product.image_url3 ||
          product.image_url4
      );
    } else {
      setThumbnail(null);
    }
    
    // Fetch review data when product changes
    fetchReviewData();
  }, [product]);

  return (
    product && (
      <div className="mt-12 animate-fadeIn">
        <p>
          <Link to={"/"}>Home</Link> /<Link to={"/products"}> Products</Link> /
          <Link to={`/products/${product.category.name.toLowerCase()}`}>
            {" "}
            {product.category.name}
          </Link>{" "}
          /<span className="text-indigo-500"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3 animate-slideInLeft">
            <div className="flex flex-col gap-3">
              {[
                product.image_url1,
                product.image_url2,
                product.image_url3,
                product.image_url4,
              ]
                .filter(Boolean)
                .map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setThumbnail(image)}
                    className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer hover:border-indigo-500 transform hover:scale-105 transition-all duration-300"
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src={thumbnail}
                alt="Selected product"
                className="transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="text-sm w-full md:w-1/2 animate-slideInRight">
            <h1 className="text-3xl font-medium animate-fadeIn">
              {product.name}
            </h1>

            <div className="flex items-center justify-between mt-1">
              <StarRating
                rating={ratingSummary.average_rating}
                totalReviews={ratingSummary.total_reviews}
                size="md"
              />
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
              >
                Write a Review
              </button>
            </div>

            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: {currency}
                {product.offerPrice}
              </p>
              <p className="text-2xl font-medium">
                MRP: {currency}
                {product.price}
              </p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.split(",").map((desc, index) => (
                <li key={index}>{desc.trim()}</li>
              ))}
            </ul>

            <div className="flex items-center mt-10 gap-4 text-base">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:scale-95"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  handleAddToCart();
                  navigate("/cart");
                }}
                className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:scale-95"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium mb-6">Customer Reviews</h2>
          
          {reviewsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.review_id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {review.user.first_name} {review.user.last_name}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRating rating={review.rating} showText={false} size="sm" />
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  )}
                </div>
              ))}
              {reviews.length > 5 && (
                <button 
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                  onClick={() => {/* Could implement show more reviews */}}
                >
                  Show more reviews ({reviews.length - 5} more)
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No reviews yet</p>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Be the first to review
              </button>
            </div>
          )}
        </div>
        
        {/*------- related products ---------*/}
        <div className="mt-16">
          <h2 className="text-2xl font-medium mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((product, index) => (
              <div
                key={index}
                className="animate-slideIn"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Review Modal */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          product={product}
          user={userData}
          onReviewSubmitted={fetchReviewData}
        />
      </div>
    )
  );
}

export default ProductDetail;
