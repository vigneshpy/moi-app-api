import mongoose from "mongoose";

const giftSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		recipient_name: { type: String, required: true },
		amount: { type: Number, required: true },
		payment_method: { type: String, enum: ["UPI", "Cash"], required: true },
		payment_status: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending",
		},
		gift_date: { type: Date, default: Date.now },
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date, default: Date.now },
	},
	{ timestamps: true } // Automatically adds created_at and updated_at fields
);

const Gift = mongoose.model("Gift", giftSchema);

export default Gift;
