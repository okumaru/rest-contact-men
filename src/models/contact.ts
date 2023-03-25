import { IContact } from "../interfaces/contact";
import { ITag } from "../interfaces/tag";
import { Schema, Types, model, Model, Document } from 'mongoose';
import TagModel, { ITagModel } from "./tag";

export interface IContactModel extends IContact, Document {}
type ContactModelType = Model<IContactModel>;

export const ContactSchema = new Schema<IContactModel, ContactModelType>(
  {
    fullname: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },

    phone: {
      type: Number,
      unique: true,
      index: true,
    },

    address: String,

    tags: [{
      type: Types.ObjectId,
      ref: "Tag"
    }],
    
  },
  { 
    timestamps: true 
  },
);

ContactSchema.post<IContactModel>("save", async function () {
  const schema: any = this;
  const contactId: Types.ObjectId = schema._id;
  const contactTags: ITagModel[] = schema.tags;

  contactTags.map(async tagId => await TagModel.updateOne({ _id: tagId }, { $push: { contacts: contactId } }));
});

ContactSchema.pre<IContactModel>("findOneAndUpdate", async function () {
  const schema: any = this;
  const contactId: Types.ObjectId = new Types.ObjectId(schema._conditions._id);

  if (schema._update.tags) {
    
    const contactData: IContactModel = await schema.model.findById(contactId);
    const contactTags: ITag[] = contactData.tags;

    contactTags.map(async tagId => await TagModel.updateOne({ _id: tagId }, { $pull: { contacts: contactId } }));
  }
});

ContactSchema.post<IContactModel>("findOneAndUpdate", async function () {
  const schema: any = this;
  const contactId: Types.ObjectId = schema._conditions._id;

  if ("tags" in schema._update.$set) {
    const contactTags: ITagModel[] = schema._update.$set.tags;
    
    contactTags.map(async tagId => await TagModel.updateOne({ _id: tagId }, { $push: { contacts: contactId } }));
  }
});

ContactSchema.post<IContactModel>("deleteOne", async function () {
  const schema: any = this;
  const contactId: Types.ObjectId = schema._conditions._id;

  await TagModel.updateMany({}, { $pull: { contacts: contactId } })
});

export default model<IContact, ContactModelType>('Contact', ContactSchema);