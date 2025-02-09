import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
	{
		event_name: { type: String, required: true },
		event_date: { type: Date, required: true },
		location: { type: String, required: true },
		creator_user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		total_collected: { type: Number, default: 0 },
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
