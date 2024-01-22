import { AppDataSource } from "../data-source";
import { Chat, User } from "../entity";
import { ChatResponse, Status } from "../types/chat";

export const ChatRepository = AppDataSource.getRepository(Chat);
