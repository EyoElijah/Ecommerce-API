import express from "express";
import User from "../models/User.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
	const hashedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_KEY).toString();

	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: hashedPassword,
	});
	try {
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (error) {
		res.json(error).status(500);
	}
});

router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		!user && res.status(401).json("wrong credentials ");

		const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_KEY);
		const passCheck = hashedPassword.toString(CryptoJS.enc.Utf8);

		passCheck !== req.body.password && res.status(401).json("wrong  credentials");
		const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "3d" });
		const { password, ...others } = user._doc;
		res.status(200).json({ ...others, accessToken });
	} catch (err) {
		res.status(500).json(err);
	}
});
export default router;
