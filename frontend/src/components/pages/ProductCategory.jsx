import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { categories } from "../../assets/assets";
import ProductCard from "../ProductCard";

function ProductCategory() {
  const { apiProduct } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLocaleLowerCase() === category
  );

  const filteredProducts = apiProduct.filter(
    (product) => product.category.name.toLocaleLowerCase() === category
  );

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 bg-indigo-700 rounded-full"></div>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p>No products found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default ProductCategory;
