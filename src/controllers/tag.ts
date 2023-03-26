import mongoose, { Error } from 'mongoose';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';
import TagModel from '../models/tag';

const getTag = async (req: Request, res: Response) => {
  const { id: _id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(_id)) 
    return res.status(404).send('No tag with that id');

  try {
    const tag = await TagModel.findOne({_id});

    res.json({ 
      data: tag
    });
  } catch (error) {
    res.status(404).json({ 
      success: false,
      message: 'Failed to get data from database'
    });
  }
}

const getTags = async (req: Request, res: Response) => {
  const { page } = req.query;

  try {
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await TagModel.countDocuments({});
    const tags = await TagModel.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({ 
      data: tags, 
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

const addTag = async (req: Request, res: Response) => {
  const tag = req.body;
  const newTag = new TagModel({...tag});

  try {

    await newTag.save();
    res.status(201).json(newTag);

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

const updateTag = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const tag = req.body;

  if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No tag with that id');

  try { 

    const updatedTag = await TagModel.findByIdAndUpdate(_id, {...tag, _id}, { new: true});
    res.json(updatedTag);

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

const removeTag = async (req: Request, res: Response) => {
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No tag with that id')

  try {

    await TagModel.deleteOne({ _id: id });
    res.json({message: 'Tag deleted successfully'});

  } catch (error) {

    res.status(404).json({ 
      success: false,
      message: 'Failed to delete data from database'
    });

  }
}

export {
  getTag,
  getTags,
  addTag,
  updateTag,
  removeTag
}