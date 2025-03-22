import mongoose from "mongoose";
import RSVP from "./RSVPModel"; // Import RSVP model

const eventSchema = new mongoose.Schema(
	{
		event_name: { type: String, required: true },
		event_date: { type: Date, required: true },
		location: { type: String, required: true },
		description: { type: String, default: "" },
		status: {
			type: String,
			enum: ["upcoming", "ongoing", "completed"],
			default: "upcoming",
		},
		type: {
			type: String,
			enum: ["wedding", "birthday", "corporate", "other"],
			required: true,
		},
		budget: { type: Number, default: 0 },
		currency: { type: String, default: "INR" },

		// User & Organizer Details
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

		// RSVP Flag
		generate_rsvp: { type: Boolean, default: false },

		// Payment & QR Code
		qr_code_url: { type: String, default: "" },
		total_collected: { type: Number, default: 0 },

		// Reminders & Recurring Events
		reminder_date: { type: Date },
		recurring: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

// Pre-save hook to set reminder_date & trigger RSVP creation
eventSchema.pre("save", async function (next) {
	if (this.event_date) {
		const reminderDate = new Date(this.event_date);
		reminderDate.setDate(reminderDate.getDate() - 2);
		this.reminder_date = reminderDate;
	}

	// Check if RSVP needs to be created
	if (this.generate_rsvp) {
		const existingRSVP = await RSVP.findOne({ event_id: this._id });
		if (!existingRSVP) {
			const newRSVP = new RSVP({ event_id: this._id });
			await newRSVP.save();
		}
	}

	next();
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
