import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { UserRepository } from "../../models/user";
import { CommunicationsRepository } from "../../models/communications";

export const userHandler = async (io: Server, socket: Socket) => {
  try {
    const token = socket.handshake.auth.token;

    jwt.verify(token, "secret", async (err, decoded) => {
      if (!err && decoded) {
        socket.join(decoded.id);

        await CommunicationsRepository.upsert(
          {
            userId: decoded.id as string,
            webSocketId: socket.id,
          },
          ["userId"]
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
};
