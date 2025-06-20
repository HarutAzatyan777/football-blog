import { ObjectId } from "mongodb";

export interface MongoPost {
  _id?: ObjectId;
  title: string;
  content: string;
  createdAt: Date;
}
