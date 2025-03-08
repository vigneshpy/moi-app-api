import express from "express";
import Event from "../models/eventModel.js";

const router = express.Router();

//create event
router.post("/create", async (req, res) => {
	try {
		const newEvent = new Event(req.body);
		const saveEvent = await newEvent.save();
		res.status(201).json(saveEvent);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
});

//List all the events created by the user
router.get("/user/:userId", async (req, res) => {
	try {
		const currentUserId = req.params?.userId;
		const event = await Event.find(
			{ user_id: currentUserId },
			"event_name location event_date"
		);
		res.status(201).json(event);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
});

router.get("/", async (req, res) => {
	try {
		res.status(400).json("invalid");
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
});

export default router;
