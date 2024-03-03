import { AppDataSource } from "../data-source";
import { Communications } from "../entity";

export const CommunicationsRepository =
  AppDataSource.getRepository(Communications);
