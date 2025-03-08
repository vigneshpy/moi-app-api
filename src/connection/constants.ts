import dotenv from "dotenv";
dotenv.config();

const DATABASE_USER_NAME = encodeURIComponent(
	process.env.DATABASE_USER_NAME || ""
);

const DATABASE_NAME = process.env.DATABASE_NAME || "moi-app";
const DATA_BASE_PASSWORD = encodeURIComponent(
	process.env.DATABASE_PASSWORD || ""
);
const DATABASE_CLUSTER_ID = encodeURIComponent(
	process.env.DATABASE_CLUSTER_ID || "njhcz"
);
const JWT_SECRET = process.env.JWT_SECRET || "";
const NODE_ENV = process.env.NODE_ENV || "development";
export const DATA_BASE_URI = `mongodb+srv://${DATABASE_USER_NAME}:${DATA_BASE_PASSWORD}@${DATABASE_NAME}.${DATABASE_CLUSTER_ID}.mongodb.net/?retryWrites=true&w=majority&appName=moi-app`;
export { JWT_SECRET, NODE_ENV };
