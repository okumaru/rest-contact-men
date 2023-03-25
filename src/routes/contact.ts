import express from 'express';
import { getContact, getContacts, addContact, updateContact, removeContact } from '../controllers/contact';

const router = express.Router();

router.get('/:id', getContact); // get one
router.get('/', getContacts); // get all
router.put('/', addContact); // add
router.post('/:id', updateContact); // edit
router.delete('/:id', removeContact); // delete

export default router