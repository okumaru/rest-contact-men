import mongoose, { Error } from 'mongoose';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';
import ContactModel from '../models/contact';

const getContact = async (req: Request, res: Response) => {
  const { id: _id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(_id)) 
    return res.status(404).send('No contact with that id');

  try {
    const contact = await ContactModel.findOne({_id}).populate('tags');

    res.json({ 
      data: contact
    });
  } catch (error) {
    res.status(404).json({ 
      success: false,
      message: 'Failed to get data from database'
    });
  }
}

const getContacts = async (req: Request, res: Response) => {
  const { page } = req.query;

  try {
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await ContactModel.countDocuments({});
    const contacts = await ContactModel.find()
      .populate('tags')
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({ 
      data: contacts, 
      currentPage: Number(page), 
      numberOfPages: Math.ceil(total / LIMIT)
    });
  } catch (error) {    
    res.status(404).json({ 
      success: false,
      message: 'Failed to get data from database'
    });
  }
}

const addContact = async (req: Request, res: Response) => {
  const contact = req.body;
  const newContact = new ContactModel({...contact});

  try {

    await newContact.save();
    res.status(201).json(newContact);

  } catch (error) {

    if (error instanceof Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Could not create contact due to some invalid fields!',
        error: messages,
      });
    } else if ((error as MongoError).code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A contact with this this unique key already exists!',
      });
    };

    res
      .status(500)
      .json({ 
        success: false, 
        message: 'Internal server error', error 
      });
  }
}

const updateContact = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const contact = req.body;

  if(!mongoose.Types.ObjectId.isValid(_id)) 
    return res.status(404).send('No contact with that id');

  try {

    const updatedContact = await ContactModel.findByIdAndUpdate(_id, {...contact, _id}, { new: true});
    res.json(updatedContact)

  } catch (error) {

    if (error instanceof Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Could not create contact due to some invalid fields!',
        error: messages,
      });
    } else if ((error as MongoError).code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A contact with this this unique key already exists!',
      });
    };

    res
      .status(500)
      .json({ 
        success: false, 
        message: 'Internal server error', error 
      });
  }
}

const removeContact = async (req: Request, res: Response) => {
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)) 
    return res.status(404).send('No contact with that id');

  try {

    await ContactModel.deleteOne({ _id: id });
    res.json({message: 'Contact deleted successfully'})

  } catch (error) {

    res.status(404).json({ 
      success: false,
      message: 'Failed to delete data from database'
    });

  }
}

export {
  getContact,
  getContacts,
  addContact,
  updateContact,
  removeContact
}