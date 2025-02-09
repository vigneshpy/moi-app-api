import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/add", async (req, res) => {
	try {
		const newUser = new User(req.body);
		const saveUser = await newUser.save();
		res.status(201).json(saveUser);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get("/", async (req, res) => {
	try {
		res.send("Add user");
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

export default router;
