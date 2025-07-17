import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import ProductCard from "../ProductCard";

function AllProducts() {
  const { searchQuery, apiProduct} = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        apiProduct.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(apiProduct);
    }
  }, [apiProduct, searchQuery]);

  

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
      </div>
      <div className="w-16 h-0.5 bg-indigo-800 rounded-full"></div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-6 ">
        {filteredProducts
          .filter((product) => product.stock === "available")
          .map((product, index) => {
            return <ProductCard key={product.product_id} product={product} />;
          })}
      </div>
    </div>
  );
}

export default AllProducts;
