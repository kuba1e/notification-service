import { Server, Socket } from "socket.io";

export const chatHandler = (io: Server, socket: Socket) => {
  try {
    socket.on("DIALOGS:JOIN", (chatId) => {
      socket.join(chatId);
    });
  } catch (err) {
    console.log(err);
  }
};
