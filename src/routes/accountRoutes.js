import express from "express";
import Account from "../models/accountModel.js";

const router = express.Router();

router.post("/add", async (req, res) => {
	try {
		const newAccount = new Account(req.body);
		const saveAccount = await newAccount.save();
		res.status(201).json(saveAccount);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get("/", async (req, res) => {
	try {
		res.send("Add account");
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

export default router;
