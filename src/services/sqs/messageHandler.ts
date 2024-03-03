import { Server } from "socket.io";
import { processMessage } from "../../utils/processMessage";
import { Message } from "@aws-sdk/client-sqs";

export function messageHandler(message: Message) {
  const parsedMessage = JSON.parse(message.Body);
  processMessage(parsedMessage);
}
