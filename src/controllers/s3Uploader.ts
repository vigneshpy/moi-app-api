import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createCanvas } from "canvas";
import { v4 as uuidv4 } from "uuid";
import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } from "../connection/constants";

const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
	},
});

const generateCoverImage = async (eventName, eventDate) => {
	const width = 800;
	const height = 400;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	ctx.fillStyle = "#3498db";
	ctx.fillRect(0, 0, width, height);

	ctx.fillStyle = "#ffffff";
	ctx.font = "bold 40px Arial";
	ctx.fillText(eventName, 50, 100);

	ctx.font = "30px Arial";
	ctx.fillText(eventDate, 50, 160);

	return canvas.toBuffer("image/png");
};

const uploadToS3 = async (buffer) => {
	const key = `covers/${uuidv4()}.png`;
	const uploadParams: any = {
		Bucket: process.env.AWS_S3_BUCKET,
		Key: key,
		Body: buffer,
		ContentType: "image/png",
	};
	console.log("uploadParams: ", uploadParams);

	await s3.send(new PutObjectCommand(uploadParams));
	return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const generateAndUploadCover = async (eventName, eventDate) => {
	const buffer = await generateCoverImage(eventName, eventDate);
	return uploadToS3(buffer);
};
