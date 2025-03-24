import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const rsvpSchema = new mongoose.Schema(
	{
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
			immutable: true,
		},
		rsvp_link: { type: String, unique: true },

		responses: [
			{
				uid: { type: String, unique: true },
				name: { type: String, required: true },
				email: { type: String, sparse: true },
				phone: { type: String, sparse: true },
				response: {
					type: String,
					enum: ["Yes", "No"],
					required: true,
				},
				comment: { type: String, default: "" },
				created_at: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

// Auto-generate RSVP link
rsvpSchema.pre("save", function (next) {
	if (!this.rsvp_link) {
		this.rsvp_link = `/rsvp/${this.event_id}/${uuidv4()}`;
	}
	next();
});

const RSVP = mongoose.model("RSVP", rsvpSchema);
export default RSVP;
