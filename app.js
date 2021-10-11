import dotenv from "dotenv";
import express from "express";
import connectDb from "./db/connect.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import cartRoute from "./routes/Cart.js";
import orderRoute from "./routes/Order.js";
const app = express();
dotenv.config();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

// server and database
const start = async () => {
	try {
		app.listen(process.env.PORT, () => console.log(`server started on port ${process.env.PORT}`));
		await connectDb(process.env.MONGO_URI);
	} catch (error) {
		console.log("something went wrong");
	}
};

start();
