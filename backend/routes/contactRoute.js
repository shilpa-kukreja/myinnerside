import express from 'express';
import { contactmessage, deleteContact, getAllContacts } from '../controllers/contactController.js';


const contactRouter = express.Router();

contactRouter.post('/contact', contactmessage);
contactRouter.get("/contacts", getAllContacts);
contactRouter.delete("/contacts/:id", deleteContact);

export default contactRouter;

