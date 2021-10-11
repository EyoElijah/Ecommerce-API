import express from "express";
import { verifyToken, verifyTokenAuth, verifyTokenAdmin } from "./verifyToken.js";
import Order from "../models/Order.js";
const router = express.Router();

// Create
router.post("/", verifyToken, async (req, res) => {
	const newOrder = new Order(req.body);
	try {
		const savedOrder = await newOrder.save();
		res.status(200).json(savedOrder);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.put("/:id", verifyTokenAdmin, async (req, res) => {
	try {
		const updatedOrder = await Order.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedOrder);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
	try {
		await Order.findByIdAndDelete(req.params.id);
		res.status(200).json("Order has been deleted");
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:userId", verifyTokenAuth, async (req, res) => {
	try {
		const orders = await Order.find({ userId: req.params.userId });
		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json(err);
	}
});

// get all product
router.get("/", verifyTokenAdmin, async (req, res) => {
	try {
		const orders = await Order.find();
		res.json(orders).status(200);
	} catch (error) {
		res.json(error).status(500);
	}
});

// Get MONTHLY INCOME

router.get("/income/stats", verifyTokenAdmin, async (req, res) => {
	const date = new Date();
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
	try {
		const income = await Order.aggregate([
			{ $match: { createdAt: { $gte: previousMonth } } },
			{
				$project: {
					month: { $month: "$createdAt" },
					sales: "$amount",
				},
			},
			{
				$group: {
					_id: "$month",
					total: { $sum: "$sales" },
				},
			},
		]);
		res.json(income).status(200);
	} catch (err) {
		res.status(500).json(err);
	}
});
export default router;
