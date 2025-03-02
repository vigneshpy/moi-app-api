import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUsername = encodeURIComponent(process.env.DATABASE_USER_NAME);

const dbNAme = encodeURIComponent(process.env.DATABASE_NAME || "moi-app");

const dbPassword = encodeURIComponent(process.env.DATABASE_PASSWORD);

const bdClusterID = encodeURIComponent(
	process.env.DATABASE_CLUSTER_ID || "njhcz"
);

const dbURI = `mongodb+srv://${dbUsername}:${dbPassword}@${dbNAme}.${bdClusterID}.mongodb.net/?retryWrites=true&w=majority&appName=moi-app`;

const clientOptions = {
	serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const connectDB = async function run() {
	try {
		await mongoose.connect(dbURI, clientOptions);
		await mongoose.connection.db.admin().command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} catch (e) {
	} finally {
	}
};

mongoose.connection.on("connected", () => {
	console.log("Mongoose default connection is open");
});

mongoose.connection.on("error", (err) => {
	console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
	console.log("Mongoose default connection is disconnected");
});

export default connectDB;
