import { SQS_MESSAGE_TYPE } from "../types/sqs";
import { ChatRepository } from "../models/chat";

import { ioClient } from "../server";
import { redisClient } from "../services/redis/redis";
import { sendEmail } from "../services/email/email";

export async function processMessage(message: any) {
  switch (message.type) {
    case SQS_MESSAGE_TYPE.NEW_MESSAGE:
      const chatSockets = await ioClient
        .to(message.payload.chatId)
        .fetchSockets();

      const chat = await ChatRepository.findOne({
        relations: {
          users: true,
        },
        where: {
          id: message.payload.chatId,
        },
      });

      const chatUsers = chat.users
        .filter(({ id }) => id !== message.payload.creatorId)
        .map((user) => user.id);

      const socketIds = [];

      for (const chatUser of chatUsers) {
        const socketId = await redisClient.hGet(`${chatUser}`, "webSocketId");
        socketIds.push(socketId);
      }

      sendEmail();

      socketIds.forEach((socketId) => {
        const userOpenedChat = chatSockets.find(
          (socket) => socket.id === socketId
        );

        if (userOpenedChat) {
          userOpenedChat.emit("NEW_MESSAGE", message.payload);
          return;
        }

        ioClient.to(socketId).emit("NOTIFICATION", message.payload);
      });

      break;
  }
}
