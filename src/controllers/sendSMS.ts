import AWS from "aws-sdk";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

AWS.config.update({
	region: "ap-south-1",
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sns = new AWS.SNS();

export const sendOTP = async (phoneNumber, otp) => {
	try {
		const params = {
			Message: `Your OTP is: ${otp}`,
			PhoneNumber: phoneNumber,
		};
		await sns.publish(params).promise();
		console.log("OTP sent via AWS SNS");
		return true;
	} catch (error) {
		console.error("Error sending OTP via SNS:", error);
		return false;
	}
};

export const generateOTP = (length = 6) => {
	return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
};
