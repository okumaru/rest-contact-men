import express from 'express';
import { getTag, getTags, addTag, updateTag, removeTag } from '../controllers/tag';

const router = express.Router();

router.get('/:id', getTag); // get one
router.get('/', getTags); // get all
router.put('/', addTag); // add
router.post('/:id', updateTag); // edit
router.delete('/:id', removeTag); // delete

export default router