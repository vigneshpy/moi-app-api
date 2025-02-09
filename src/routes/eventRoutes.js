import express from "express";
import Event from "../models/eventModel.js";

const router = express.Router();

router.post("/add", async (req, res) => {
	try {
		const newEvent = new Event(req.body);
		const saveEvent = await newEvent.save();
		res.status(201).json(saveEvent);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get("/", async (req, res) => {
	try {
		res.send("Add events");
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

export default router;
