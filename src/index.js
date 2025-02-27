import express from "express";

import connectDB from "./connection/db.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import acountRoutes from "./routes/accountRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
const app = express();
const port = 3000;

connectDB();
app.use(express.json());

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
app.use("/users", userRoutes);
app.use("/accounts", acountRoutes);
app.use("/auth", authRoutes);
