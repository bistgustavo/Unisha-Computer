import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import ProductCard from "../ProductCard";

function AllProducts() {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.lenght > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
      </div>
      <div className="w-16 h-0.5 bg-indigo-800 rounded-full"></div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-6 ">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => {
            return <ProductCard key={product._id} product={product} />;
          })}
      </div>
    </div>
  );
}

export default AllProducts;
