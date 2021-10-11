import express from "express";
import { verifyTokenAuth, verifyTokenAdmin } from "./verifyToken.js";
import Cart from "../models/Cart.js";
const router = express.Router();

// Create
router.post("/", verifyTokenAuth, async (req, res) => {
	const newCart = new Cart(req.body);
	try {
		const savedCart = await newCart.save();
		res.status(200).json(savedCart);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.put("/:id", verifyTokenAuth, async (req, res) => {
	try {
		const updatedCart = await Cart.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedCart);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.delete("/:id", verifyTokenAuth, async (req, res) => {
	try {
		await Cart.findByIdAndDelete(req.params.id);
		res.status(200).json("Cart has been deleted");
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:userId", verifyTokenAuth, async (req, res) => {
	try {
		const Cart = await Cart.findOne({ userId: req.params.userId });
		res.status(200).json(Cart);
	} catch (err) {
		res.status(500).json(err);
	}
});

// get all product
router.get("/", verifyTokenAdmin, async (req, res) => {
	try {
		const carts = await Cart.find();
		res.json(Carts).status(200);
	} catch (error) {
		res.json(error).status(500);
	}
});

export default router;
