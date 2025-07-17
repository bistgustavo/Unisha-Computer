import React, { useState, useRef, useEffect } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

function AddProduct() {
  const [files, setFiles] = useState(Array(4).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [quantity, setQuantity] = useState(""); // New state for quantity
  const fileInputRefs = useRef(Array(4).fill(null));
  const { api, apiFile, categoryData, setCategoryData, isSeller } =
    useAppContext();

  const getAllCategories = async () => {
    try {
      if (isSeller) {
        const response = await api.get("/category/getallcategories");

        if (response.status === 200) {
          setCategoryData(response.data.data);
        } else {
          console.log("Failed to fetch categories:", response.data.message);
        }
      }
    } catch (error) {
      console.error("API Error:", error.message);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, [isSeller]);

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedFiles = [...files];
      updatedFiles[index] = file;
      setFiles(updatedFiles);
    }
  };

  const triggerFileInput = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = ""; // Reset input to allow reselecting same file
      fileInputRefs.current[index].click();
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !price || !quantity || !category) {
      toast.error("Name, price, quantity, and category are required!");
      return;
    }

    try {
      const formData = new FormData();
      setIsSubmitting(true);

      // Append files
      files.forEach((file, index) => {
        if (file) {
          formData.append(`image${index + 1}`, file)
        }else{
          formData.append(`image${index + 1}`, null)
        }
      });

      // Append other fields (ensure correct data types)
      formData.append("name", name);
      formData.append("description", description || "");
      formData.append("category_id", category);
      formData.append("price", parseFloat(price).toString());
      formData.append("quantity", parseInt(quantity).toString());
      if (offerPrice)
        formData.append("offerPrice", parseFloat(offerPrice).toString());


      const response = await apiFile.post("/product/addproduct", formData);

      if (response.status === 201) {
        // Reset form
        setFiles(Array(4).fill(null));
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setQuantity("");
        toast.success("Product added successfully!");
      }
    } catch (error) {
      console.error("Full error:", error.response?.data); // Log backend validation errors
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col">
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <div key={index} className="relative">
                  <input
                    ref={(el) => (fileInputRefs.current[index] = el)}
                    onChange={(e) => handleImageChange(index, e)}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <label htmlFor={`image${index}`} className="cursor-pointer">
                    <img
                      className="max-w-24"
                      src={
                        files[index]
                          ? URL.createObjectURL(files[index])
                          : assets.upload_area
                      }
                      alt="uploadArea"
                      width={100}
                      height={100}
                    />
                  </label>
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          ></textarea>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            value={category}
            id="category"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {Array.isArray(categoryData) &&
              categoryData.map((item, index) => (
                <option key={item.category_id} value={item.category_id}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>
        {/* New Quantity Field */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-quantity">
            Quantity Available
          </label>
          <input
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
            id="product-quantity"
            type="number"
            min="0"
            placeholder="Enter available quantity"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          ) : (
            <span>ADD</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
