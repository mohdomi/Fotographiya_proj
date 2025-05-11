import { Router } from "express";
import Wedding from "../db/schemas/wedding.js";

const router = Router();


router.get('/weddingDetails/:weddingId', async (req, res) => {
    try {
        const weddingId = req.params.weddingId;

        console.log(weddingId);

        const details = await Wedding.findById(weddingId).populate('categories');

        res.status(200).json({
            message: "Wedding found.",
            details
        })
    } catch (error) {
        return res.status(400).json({
            message: "Error : /get-wedding-details",
            error
        })
    }
})


router.post('/create-wedding', async (req, res) => {

    try {
        const body = req.body;
        // {name , package , categories , createdAt}

        const result = await Wedding.create({
            name: body.name,
            createdAt: Date.now()
        })

        return res.status(200).json({
            message: "Wedding Created",
            result
        })
    } catch (error) {

        return res.status(400).json({
            message: "error occured.",
            error
        })

    }

})
 // left these for now

router.put('/update-wedding', (req, res) => {

    res.json({
        message: "under construction"
    })

})


router.delete('/delete-wedding', async (req, res) => {

    res.json("under construction");
})


router.get('/all-weddings' , async (req,res)=>{

    try{

        const weddings = Wedding.find({});

        return res.status(200).json({
            weddings
        })

    }catch(error){

        return res.status(400).json({
            message : "Error in get all weddings.",
            error
        })

    }

})



export default router;
