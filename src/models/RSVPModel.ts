import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const rsvpSchema = new mongoose.Schema(
	{
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		rsvp_link: { type: String },

		invitees: [
			{
				name: { type: String, required: true },
				phone: { type: String, required: true },
				invite_status: {
					type: String,
					enum: ["pending", "sent", "delivered", "failed"],
					default: "pending",
				},
				delivery_method: {
					type: String,
					enum: ["sms", "whatsapp"],
					default: "sms",
				},
				message_sid: { type: String },
			},
		],
	},
	{ timestamps: true }
);

// Auto-generate RSVP link
rsvpSchema.pre("save", function (next) {
	if (!this.rsvp_link) {
		this.rsvp_link = `/rsvp/${uuidv4()}`;
	}
	next();
});

const RSVP = mongoose.model("RSVP", rsvpSchema);
export default RSVP;
