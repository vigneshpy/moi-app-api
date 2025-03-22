import express from "express";
import OTP from "../models/OTPModel";
import User from "../models/userModel";
import { generateOTP, sendOTP } from "../controllers/sendSMS";
import {
	validateSendOTP,
	validateVerifyOTP,
} from "../middleware/validateRequest.middleware";
import { JWT_SECRET, NODE_ENV } from "../connection/constants";
import jwt from "jsonwebtoken";

const router = express.Router();

// Send OTP route with validation middleware
router.post("/send", validateSendOTP, async (req: any, res: any) => {
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
			return res
				.status(500)
				.json({ error: "Failed to send OTP. Please try again." });
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
		const {
			phone_number,
			otp: receivedOTP,
			first_name,
			last_name,
			email,
		} = req.body;

		// Find the latest OTP entry
		const storedOTP = await OTP.findOne({ phone_number }).sort({
			createdAt: -1,
		});

		if (!storedOTP) {
			throw new Error("No OTP found for this phone number!");
		}

		if (storedOTP.expiresAt < new Date()) {
			throw new Error("OTP has expired!");
		}
		//skip otp verification for dev
		if (storedOTP.otp !== receivedOTP && NODE_ENV != "development") {
			throw new Error("Invalid OTP!");
		}

		await OTP.updateOne({ _id: storedOTP._id }, { verified: true });

		let user = await User.findOne({ phone_number });

		if (user) {
			const updateData: any = { is_verified: true };

			if (first_name) updateData.first_name = first_name;
			if (last_name) updateData.last_name = last_name;
			if (email) updateData.email = email;

			await User.updateOne({ _id: user._id }, updateData);
		} else {
			user = new User({
				phone_number,
				is_verified: true,
				first_name: first_name || "",
				last_name: last_name || "",
				email: email || "",
			});
			await user.save();
		}

		const token = jwt.sign(
			{
				userId: user._id,
				phone_number,
			},
			JWT_SECRET,
			{
				expiresIn: "24h",
			}
		);

		// Set JWT in HttpOnly Cookie
		res.cookie("token", token, {
			httpOnly: true, // Prevent JavaScript access (XSS protection)
			secure: process.env.NODE_ENV === "production", // Secure in production
			sameSite: "strict",
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			message: "OTP verified successfully, user updated!",
			user,
		});
	} catch (err: any) {
		console.error("Error:", err);
		res.status(400).json({ error: err.message });
	}
});

export default router;
