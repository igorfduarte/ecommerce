import express from "express";
import {addOrderItems,getOrderById,updateOrderToPaid,getMyOrders,getOrders,updateOrderToDelivered} from '../controllers/order.controller.js'
import { protect,admin } from "../middleware/auth.middleware.js";

const router = express.Router();


router.route("/").post(protect,addOrderItems).get(protect,admin,getOrders)
router.route('/myorders').get(protect,getMyOrders)
router.route("/:id").get(protect,getOrderById)
router.route("/:id/pay").put(protect,updateOrderToPaid)
router.route("/:id/delivered").put(protect,updateOrderToDelivered)

export default router