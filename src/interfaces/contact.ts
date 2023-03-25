import { ITag } from "./tag";
import { Types } from 'mongoose';

export interface IContact {
  // _id: Types.ObjectId;
  fullname: string;
  email: string;
  phone?: number;
  address?: string;
  tags: ITag[];
}