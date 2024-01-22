import { Server } from "socket.io";
import { processMessage } from "../../utils/processMessage";

export function messageHandler(io: Server) {
  return async (message) => {
    const parsedMessage = JSON.parse(message.Body);
    processMessage(parsedMessage, io);
  };
}
