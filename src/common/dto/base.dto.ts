import { Document } from "mongoose";
export interface BaseSchema extends   Document {
    createdAt: string;
    updatedAt: string;
  }
  