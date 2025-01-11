import express from 'express';
import { addBook, getBooks, getTopKBooks } from '../controllers/bookController';

const router = express.Router();

router.post('/add', addBook);
router.get('/', getBooks);
router.get('/top-k/:k', getTopKBooks);

export default router;
