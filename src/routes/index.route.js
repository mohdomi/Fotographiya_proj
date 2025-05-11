import { Router } from "express";
import weddingRouter from './wedding.route.js';
import categoryRouter from './category.route.js';
import imageRouter from './image.route.js';
import userRouter from './user.route.js';
import adminRouter from './admin.route.js'; 


const router = Router();

router.use('/wedding' , weddingRouter);
router.use('/category' , categoryRouter);
router.use('/image' , imageRouter);
router.use('/user' , userRouter);
router.use('/admin' , adminRouter);


router.get('/' , (req,res)=>{
    res.json({
        message : "Hi there"
    })
})



export default router;