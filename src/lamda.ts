import serverlessExpress from "@vendia/serverless-express";
import app from "./";

export const handler = serverlessExpress({ app });
