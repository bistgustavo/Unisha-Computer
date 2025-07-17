import { Router } from "express";
import {
  createProduct,
  allProducts,
  productByCategory,
  bestSellingProducts,
  searchProducts,
} from "../controllers/products.controller";
import { verifyJWT } from "../middlewares/auth";
import { upload } from "../middlewares/multer.middlewares";

const router = Router();

router.route("/addproduct").post(
  verifyJWT,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  createProduct
);

router.route("/allproducts").get(allProducts);

router.route("/productbycategory/:category_id").get(productByCategory);

router.route("/bestselling").get(bestSellingProducts);
router.get("/search", searchProducts);

export default router;
