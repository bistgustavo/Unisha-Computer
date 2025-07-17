import { Router } from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} from "../controllers/category.controller";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

router.post("/addcategory", verifyJWT, createCategory);
router.put("/updatecategory/:id", verifyJWT, updateCategory);
router.delete("/deletecategory/:id", verifyJWT, deleteCategory);
router.get("/getallcategories", verifyJWT, getAllCategories);
router.get("/getcategory/:id", getCategoryById);

export default router;
