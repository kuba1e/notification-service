import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import sqsQuery from "./services/sqs/sqs";
import { messageHandler } from "./services/sqs/messageHandler";
import { userHandler } from "./services/webSocket/userHandler";
import { chatHandler } from "./services/webSocket/chatHandler";
import { Consumer } from "sqs-consumer";
import { SQSClient } from "@aws-sdk/client-sqs";
import { redisClient } from "./services/redis/redis";
import { connectToDatabase } from "./connectToDatabase";
import { AppDataSource } from "./data-source";

const queueUrl = process.env.AWS_SQS_QUEUE_URL;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const port = process.env.PORT || 3000;

const app = express();

const httpServer = createServer(app);
export const ioClient = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const consumer = Consumer.create({
  queueUrl,
  handleMessage: async (message) => {
    messageHandler(message);
  },
  sqs: new SQSClient({
    region: "eu-north-1",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  }),
});

sqsQuery.on("error", (err) => {
  console.error(err.message);
});

sqsQuery.on("processing_error", (err) => {
  console.error(err.message);
});

sqsQuery.on("timeout_error", (err) => {
  console.error(err.message);
});

const startup = async () => {
  consumer.start();

  await AppDataSource.initialize();

  ioClient.on("connection", (socket) => {
    userHandler(ioClient, socket);
    chatHandler(ioClient, socket);
  });
};

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  startup();
  redisClient.connect();
});
