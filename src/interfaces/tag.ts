import { IContact } from "./contact";
import { Types } from 'mongoose';

export interface ITag {
  // _id: Types.ObjectId;
  name: string;
  contacts?: IContact[];
}