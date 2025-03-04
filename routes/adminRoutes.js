import express from 'express';
import { authPage, authRoute } from '../middlewares/tokencheckers.js';
import { 
    BN_post,
    home_get,
    mkAdmin_post,
    RA_post,
    adminsReply_post,
    scripture_post
 } from '../controllers/adminController.js';

const router = express.Router();

router.get('/', authPage, home_get);

router.put('/webtoon/updatestatus', authRoute, RA_post);

router.put('/isban/:id', authRoute, BN_post); 

router.put('/makeadmin/:id', authRoute, mkAdmin_post); 

router.post('/scripture', authRoute, scripture_post)

router.post('/reply', authRoute, adminsReply_post)

export default router; 