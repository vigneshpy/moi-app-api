import express from "express";

import connectDB from "./connection/db";
import eventRoutes from "./routes/eventRoutes";
import giftRoutes from "./routes/giftRoutes";
import userRoutes from "./routes/userRoutes";
import acountRoutes from "./routes/accountRoutes";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/auth.middleware";
dotenv.config({ path: "../.env" });
const app = express();
const port = 3000;

connectDB();
app.use(express());
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("MOI APP API");
});

app.get("/healthz", (req, res) => {
	res.send("Running successfully");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

app.use("/events", verifyToken, eventRoutes);
app.use("/gifts", verifyToken, giftRoutes);
app.use("/users", verifyToken, userRoutes);
app.use("/accounts", verifyToken, acountRoutes);
app.use("/auth", authRoutes);
