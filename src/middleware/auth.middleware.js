import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	// const token =
	// 	req.headers["x-access-token"] || req.headers.authorization?.split(" ")[1];

	// if (!token) {
	// 	return res.status(401).json({ message: "No token provided" });
	// }

	try {
		if(!req.cookies || !req.cookies.token){
			return res.status(401).send("Unauthorized");
		}

		const token = req.cookies.token;
		
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
};
