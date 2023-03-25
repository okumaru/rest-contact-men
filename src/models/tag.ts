import { ITag } from "../interfaces/tag";
import { IContact } from "../interfaces/contact";
import { Schema, Types, model, Model, Document } from 'mongoose';
import ContactModel, { IContactModel } from "./contact";

export interface ITagModel extends ITag, Document {}
type TagModelType = Model<ITagModel>;

export const TagSchema = new Schema<ITagModel, TagModelType>(
  {
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      lowercase: true,
      unique: true,
      index: true,
    },

    contacts: [{
      type: Types.ObjectId,
      ref: "Contact"
    }],
  },
  { 
    timestamps: true 
  },
);

TagSchema.pre<ITagModel>("findOneAndUpdate", async function () {
  const schema: any = this;
  const tagId: Types.ObjectId = new Types.ObjectId(schema._conditions._id);

  if (schema._update.contacts) {

    const tagData: ITagModel = await schema.model.findById(tagId);
    const tagContacts: IContact[] = tagData.contacts ?? [];

    tagContacts.map( async contactId => await ContactModel.updateOne({ _id: contactId }, { $pull: { tags: tagId } }))
  }
});

TagSchema.post<ITagModel>("findOneAndUpdate", async function () {
  const schema: any = this;
  const tagId: Types.ObjectId = schema._conditions._id;

  if ("contacts" in schema._update.$set) {
    const tagContacts: IContactModel[] = schema._update.$set.contacts;

    tagContacts.map(async contactId => await ContactModel.updateOne({ _id: contactId }, { $push: { tags: tagId } }));
  }
});

TagSchema.post<ITagModel>("deleteOne", async function () {
  const schema: any = this;
  const tagId: Types.ObjectId = schema._conditions._id;

  await ContactModel.updateMany({}, { $pull: { tags: tagId } });
});

export default model<ITag, TagModelType>('Tag', TagSchema);