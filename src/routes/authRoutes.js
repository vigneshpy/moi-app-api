import express from "express";
import { register, login } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// router.get("/profile", authenticate, (req, res) => {
// 	res.status(200).send(`Welcome user ${req.user.userId}`);
// });

export default router;
