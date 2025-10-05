import express from 'express';
import { authRoute, authUser } from '../middlewares/tokencheckers.js';
import { 
    author_get,
    home_get,
    slash_get,
    complaint_post,
    get_me
} from '../controllers/otherController.js';

const router = express.Router();

router.get('/', slash_get);

router.get('/home', home_get);

router.get('/home/me', authUser, get_me);

router.get('/author', authRoute, author_get);

router.post('/complain', complaint_post);
 
export default router; 