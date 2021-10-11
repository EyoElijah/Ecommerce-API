import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
	const authHeader = req.headers.token;
	if (!authHeader) {
		return res.status(403).json("you are not authenticated");
	}
	try {
		const token = authHeader.split(" ")[1];
		const verifyUser = await jwt.verify(token, process.env.SECRET_KEY);
		req.user = verifyUser;
		next();
	} catch (error) {
		res.send("token is invalid");
	}
};

const verifyTokenAuth = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id || req.user.isAdmin) {
			next();
		} else {
			res.status(403).json("Not Allowed");
		}
	});
};
const verifyTokenAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.isAdmin) {
			next();
		} else {
			res.status(403).json("Not Allowed");
		}
	});
};

export { verifyToken, verifyTokenAuth, verifyTokenAdmin };
