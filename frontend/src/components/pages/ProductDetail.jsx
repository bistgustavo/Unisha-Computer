import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import ProductCard from "../ProductCard";

function ProductDetail() {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0) {
      let productCopy = products.slice();
      productCopy = productCopy.filter(
        (item) => item.category === product.category
      );
      setRelatedProducts(productCopy.slice(0, 5));
    }
  }, [products]);

  useEffect(() => {
    if (product?.image?.[0]) {
      setThumbnail(product.image[0]);
    } else {
      setThumbnail(null);
    }
  }, [product]);

  return (
    product && (
      <div className="mt-12 animate-fadeIn">
        <p>
          <Link to={"/"}>Home</Link> /<Link to={"/products"}> Products</Link> /
          <Link to={`/products/${product.category.toLowerCase()}`}>
            {" "}
            {product.category}
          </Link>{" "}
          /<span className="text-indigo-500"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3 animate-slideInLeft">
            <div className="flex flex-col gap-3">
              {product.image.map((image, index) => (
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

            <div className="flex items-center gap-0.5 mt-1">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={`star-${i}`}
                    className="md:w-4 w-3.5 hover:scale-125 transition-transform duration-200"
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt="rating image"
                  />
                ))}
              <p className="text-base ml-2">4</p>
            </div>

            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: {currency}
                {product.price}
              </p>
              <p className="text-2xl font-medium">
                MRP: {currency}
                {product.offerPrice}
              </p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            <div className="flex items-center mt-10 gap-4 text-base">
              <button
                onClick={() => {
                  addToCart(product._id);
                }}
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:scale-95"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product._id, 1);
                  navigate("/cart");
                }}
                className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:scale-95"
              >
                Buy now
              </button>
            </div>
          </div>
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
      </div>
    )
  );
}

export default ProductDetail;
