import { Router } from "express";
import Image from "../db/schemas/image.js";
import { uploadImage } from "../cloudinary/index.js";
import Category from "../db/schemas/category.js";
import { cloudinary } from "../cloudinary/index.js";
import multer from "multer";

const router = Router();

const memory = multer.memoryStorage();
const upload = multer({
    storage: memory
})

// instead of this i put the logic in admin.route.js to upload images using cloudinary.

// this logic is only for single imag eupload. i can most probably
// use a array type something logic here to solve this most probably.

// single image
router.post('/upload-image', async (req, res) => {

    const body = req.body;

    const url = await uploadImage(body.image_path);

    const image = await Image.create({
        url, categoryId: body.categoryId, updloadedAt: Date.now()
    })

    return res.status(200).json({
        message: "image uploaded",
        image
    })

})


// const categoryUpload = async ()=>{

//     const results = await Category.findByIdAndUpdate()

// }

const imageSave = async (url, categoryId) => {
    const image_upload_result = await Image.create({
        url, categoryId, uploadedAt: Date.now()
    })
    
    await Category.findByIdAndUpdate({
        _id : categoryId
    } , {
        $push : {
            images : image_upload_result._id 
        }
    })

    console.log(image_upload_result)

    return image_upload_result.toObject();
}


router.post('/upload_images/:categoryId', upload.array('images', 50), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }

        const uploadPromises = req.files.map(file =>
            cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                { folder: 'your_folder_name' }
            )
        );
        const results = await Promise.all(uploadPromises);
        // url , categoryId , date

        const categoryId = req.params.categoryId;

        const finalResult = await Promise.all(
            results.map((r) => imageSave(r.secure_url, categoryId))
        );


        res.json({
            message: 'All images uploaded successfully!',
            images: results.map((r) => ({
                url: r.secure_url,
                public_id: r.public_id,
            })),
            finalResult
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message });
    }
});






export default router;