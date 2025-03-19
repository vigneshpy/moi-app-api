import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
	{
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
		otp: { type: String, required: true },
		verified: { type: Boolean, default: false },
		attempts: { type: Number, default: 0 },
		expiresAt: {
			type: Date,
			required: true,
			default: () => new Date(Date.now() + 5 * 60 * 1000),
		},
	},
	{ timestamps: true }
);

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;
