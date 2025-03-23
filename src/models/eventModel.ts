import mongoose from "mongoose";
import RSVP from "./RSVPModel";
import { createCanvas, loadImage } from "canvas";
import { generateAndUploadCover } from "../controllers/s3Uploader";

const eventSchema = new mongoose.Schema(
	{
		event_name: { type: String, required: true },
		event_date: { type: Date, required: true },
		location: { type: String, required: true },
		description: { type: String, default: "" },
		type: {
			type: String,
			enum: ["wedding", "birthday", "corporate", "other"],
			required: true,
			default: "other",
		},
		budget: { type: Number, default: 0 },
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		generate_rsvp: { type: Boolean, default: false },
		qr_code_url: { type: String, default: "" },
		cover_image: {
			generate_cover_image: { type: Boolean, default: false },
			cover_url: { type: "String", default: "" },
		},
		total_collected: { type: Number, default: 0 },
		reminder_date: { type: Date },
		recurring: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

async function generateCoverImage(event) {
	const canvas = createCanvas(800, 400);
	const ctx = canvas.getContext("2d");

	ctx.fillStyle = "#4A90E2";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#ffffff";
	ctx.font = "bold 36px Arial";
	ctx.fillText(event.event_name, 50, 100);

	ctx.font = "italic 24px Arial";
	ctx.fillText(new Date(event.event_date).toDateString(), 50, 160);

	ctx.font = "20px Arial";
	ctx.fillText(event.location, 50, 220);

	return canvas.toBuffer("image/png");
}

eventSchema.pre("save", async function (next) {
	if (this.event_date) {
		const reminderDate = new Date(this.event_date);
		reminderDate.setDate(reminderDate.getDate() - 2);
		this.reminder_date = reminderDate;
	}

	// Handle RSVP
	if (this.generate_rsvp) {
		const existingRSVP = await RSVP.findOne({ event_id: this._id });
		if (!existingRSVP) {
			const newRSVP = new RSVP({ event_id: this._id });
			await newRSVP.save();
		}
	}
	if (this.cover_image.generate_cover_image) {
		const coverBuffer = await generateCoverImage(this);
		const coverUrl = await generateAndUploadCover(
			coverBuffer,
			`cover_images/event_${this._id}.png`
		);
		this.cover_image.cover_url = coverUrl;
	}

	next();
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
