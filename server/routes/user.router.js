import express from "express";
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  getUser,
  editUser
} from "../controllers/user.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();
router.route("/").post(registerUser).get(protect, admin, getAllUsers);
router.post("/login", authUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.route("/:id").delete(protect, admin, deleteUser).get(protect,admin,getUser).put(protect,admin,editUser);

export default router;
