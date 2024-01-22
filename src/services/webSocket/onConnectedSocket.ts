import { Server, Socket } from "socket.io";
import { userHandler } from "./userHandler";
import { chatHandler } from "./chatHandler";

export const onConnectedSocket = (io: Server) => {
  return (socket: Socket) => {
    userHandler(io, socket);
    chatHandler(io, socket);
  };
};
