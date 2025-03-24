import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	first_name: { type: String, default: "" },
	last_name: { type: String, default: "" },
	password: { type: String },
	email: {
		type: String,
		required: function () {
			return !this.phone_number;
		}, // Required if no phone_number
	},
	phone_number: {
		type: String,
		required: function () {
			return !this.email;
		}, // Required if no email
	},
	is_verified: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});
const User = mongoose.model("User", UserSchema);

export default User;
