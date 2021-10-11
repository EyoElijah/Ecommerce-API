import mongoose from "mongoose";

const connectDb = (url) => {
	return mongoose.connect(url, () => console.log("connected successfully"));
};

export default connectDb;
