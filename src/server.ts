import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import sqsQuery from "./services/sqs/sqs";
import { connectToDatabase } from "./connectToDatabase";
import { messageHandler } from "./services/sqs/messageHandler";
import { onConnectedSocket } from "./services/webSocket/onConnectedSocket";
import { AppDataSource } from "./data-source";

const port = process.env.PORT || 3000;

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
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

sqsQuery.on("message_received", messageHandler(io));

io.on("connection", onConnectedSocket(io));

AppDataSource.initialize()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      connectToDatabase();
      sqsQuery.start();
    });
  })
  .catch((error) => {
    console.error(`error from db${error}`);
  });
