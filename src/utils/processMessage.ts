import { SQS_MESSAGE_TYPE } from "../types/sqs";
import { ChatRepository } from "../models/chat";

import { ioClient } from "../server";

export async function processMessage(message: any) {
  switch (message.type) {
    case SQS_MESSAGE_TYPE.NEW_MESSAGE:
      const chatSockets = await ioClient
        .to(message.payload.chatId)
        .fetchSockets();

      const chat = await ChatRepository.findOne({
        relations: {
          users: {
            communications: true,
          },
        },
        where: {
          id: message.payload.chatId,
        },
      });

      const chatUserSocketIds = chat.users
        .filter(({ id }) => id !== message.payload.creatorId)
        .map((user) => user.communications.webSocketId);

      chatUserSocketIds.forEach((socketId) => {
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
