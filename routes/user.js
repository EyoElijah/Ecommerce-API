import express from "express";
import { verifyTokenAuth, verifyTokenAdmin } from "./verifyToken.js";
import User from "../models/User.js";
const router = express.Router();

router.put("/:id", verifyTokenAuth, async (req, res) => {
	if (req.body.password) {
		CryptoJS.AES.encrypt(req.body.password, process.env.PASS_KEY).toString();
	}
	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Delete route
router.delete("/:id", verifyTokenAuth, async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json("user has been delete d");
	} catch (err) {
		res.status(500).json(err);
	}
});

// get user
router.get("/:id", verifyTokenAdmin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

// get all users
router.get("/", verifyTokenAdmin, async (req, res) => {
	const query = req.query.new;
	try {
		const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
		res.status(200).json({ users, count: users.length });
	} catch (err) {
		res.status(500).json(err);
	}
});

// get user status
router.get("/stats/user", verifyTokenAdmin, async (req, res) => {
	const date = new Date();
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

	try {
		const data = await User.aggregate([
			{ $match: { createdAt: { $gte: lastYear } } },
			{
				$project: {
					month: {
						$month: "$createdAt",
					},
				},
			},
			{
				$group: {
					_id: "$month",
					total: { $sum: 1 },
				},
			},
		]);
		res.status(200).json(data);
	} catch (err) {
		res.status(500).json(err);
	}
});

export default router;
