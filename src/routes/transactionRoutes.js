import express from "express";
import Transaction from "../models/transactionModel.js";

const router = express.Router();

router.post("/add", async (req, res) => {
	try {
		const transaction = new Transaction(req.body);
		const saveTransaction = await transaction.save();
		res.status(201).json(saveTransaction);
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
