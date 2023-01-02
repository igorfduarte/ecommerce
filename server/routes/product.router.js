import express from "express";
import {
  getProductById,
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  createReview,
  getTopProducts,
} from "../controllers/product.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts);

router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

router.route("/:id/reviews").post(protect, createReview);
export default router;
