import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext.jsx";

function BestSeller() {
  const { api } = useAppContext();

  const [products , setApiProducts] = useState([]);

  // Fetch best-selling products from the API
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await api.get("/product/bestselling");
        // Assuming the API returns an array of best-selling products
        if (response.status === 200) {
          setApiProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    };

    fetchBestSellers();
  }, [api]);

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>
      <div className="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-3 md:gap-6 lg:grid-cols-6 mt-6">
        {products
          ?.filter((product) => product.stock === "available") // or product.inStock === true
          ?.slice(0, 5)
          ?.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
}

export default BestSeller;
