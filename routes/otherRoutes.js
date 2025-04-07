import express from 'express';
import { authPage } from '../middlewares/tokencheckers.js';
import { 
    author_get,
    home_get,
    slash_get, 
    aboutus_get,
    complaint_post,
    // get_home_details
} from '../controllers/otherController.js';

const router = express.Router();

router.get('/', slash_get);

router.get('/home', home_get);

// router.get('/homedetails', get_home_details);

router.get('/aboutus', aboutus_get);

router.get('/author', authPage, author_get);

router.post('/complain', complaint_post);
 
export default router; 