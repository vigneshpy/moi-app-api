import { NextFunction } from "express";
import { COUNTRY_CODE } from "../connection/constants";

/**
 * Middleware to validate OTP send request
 */
export const validateSendOTP = (req, res, next: NextFunction) => {
	if (!req.body || Object.keys(req.body).length === 0) {
		return res.status(400).json({ error: "Request body is missing or empty!" });
	}
	let { phone_number } = req.body;

	if (!phone_number) {
		return res.status(400).json({ error: "Phone number is required!" });
	}

	if (!phone_number.startsWith("+")) {
		req.body.phone_number = COUNTRY_CODE + phone_number;
	}

	next();
};

export const validateVerifyOTP = (req, res, next: NextFunction) => {
	if (!req.body || Object.keys(req.body).length === 0) {
		return res.status(400).json({ error: "Request body is missing or empty!" });
	}
	let { phone_number } = req.body;

	const { otp } = req.body;
	if (!phone_number.startsWith("+")) {
		req.body.phone_number = COUNTRY_CODE + phone_number;
	}

	if (!phone_number || !otp) {
		return res
			.status(400)
			.json({ error: "Phone number and OTP are required!" });
	}

	next();
};
