import express from "express";
import OTP from "../models/OTPModel";
import { generateOTP, sendOTP } from "../controllers/sendSMS";
import { COUNTRY_CODE } from "../connection/constants";

const router = express.Router();

router.post("/send", async (req, res) => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			throw new Error("Request body is missing or empty!");
		}

		let phoneNumber = req.body.phone_number;
		if (!phoneNumber) {
			throw new Error("Phone number is required!");
		}

		if (!phoneNumber.startsWith("+")) {
			phoneNumber = COUNTRY_CODE + phoneNumber;
		}

		const otp = generateOTP();

		const saveOTP = new OTP({ phone_number: phoneNumber, otp });
		await saveOTP.save();

		await sendOTP(phoneNumber, otp);

		res.status(201).json({ message: "OTP sent successfully" });
	} catch (err: any) {
		console.error("Error:", err);
		res.status(500).json({ error: err.message });
	}
});

router.post("/verify", async (req, res) => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			throw new Error("Request body is missing or empty!");
		}

		const phoneNumber = req.body.phone_number;
		const receivedOTP = req.body.otp;

		if (!phoneNumber || !receivedOTP) {
			throw new Error("Phone number and OTP are required!");
		}

		const storedOTP = await OTP.findOne({ phone_number: phoneNumber }).sort({
			createdAt: -1,
		});

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

		res.status(200).json({ message: "OTP verified successfully!" });
	} catch (err: any) {
		console.error("Error:", err);
		res.status(400).json({ error: err.message });
	}
});

export default router;
