import express from "express";
import OTP from "../models/OTPModel";
import User from "../models/userModel";
import { generateOTP, sendOTP } from "../controllers/sendSMS";
import {
	validateSendOTP,
	validateVerifyOTP,
} from "../middleware/validateRequest.middleware";

const router = express.Router();

// Send OTP route with validation middleware
router.post("/send", validateSendOTP, async (req, res) => {
	try {
		const { phone_number } = req.body;
		const otp = generateOTP();

		const saveOTP = new OTP({
			phone_number,
			otp,
			expiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
		});
		await saveOTP.save();

		const otpSent = await sendOTP(phone_number, otp);
		if (!otpSent) {
			return res.status(500).json({ error: "Failed to send OTP. Please try again." });
		}
		res.status(201).json({ message: "OTP sent successfully" });
	} catch (err: any) {
		console.error("Error:", err);
		res.status(500).json({ error: err.message });
	}
});

// Verify OTP route with validation middleware
router.post("/verify", validateVerifyOTP, async (req, res) => {
	try {
		const { phone_number, otp: receivedOTP } = req.body;

		// Find the latest OTP entry
		const storedOTP = await OTP.findOne({ phone_number }).sort({
			createdAt: -1,
		});
		const user = await User.findOne({ phone_number });

		if (!storedOTP) {
			throw new Error("No OTP found for this phone number!");
		}

		if (storedOTP.expiresAt < new Date()) {
			throw new Error("OTP has expired!");
		}

		if (storedOTP.otp !== receivedOTP) {
			throw new Error("Invalid OTP!");
		}

		await OTP.updateOne({ _id: storedOTP._id }, { verified: true });

		if (user) {
			await User.updateOne({ _id: user._id }, { is_verified: true });
		} else {
			// Option 1: Create a new unverified user
			const newUser = new User({
				phone_number,
				is_verified: true,
				// other default fields as needed
			});
			await newUser.save();
			
			// Option 2: Return a more informative error
			// return res.status(404).json({ 
			//   error: "User not found. Please register before verifying OTP." 
			// });
		}

		res
			.status(200)
			.json({ message: "OTP verified successfully, user updated!" });
	} catch (err: any) {
		console.error("Error:", err);
		res.status(400).json({ error: err.message });
	}
});

export default router;
