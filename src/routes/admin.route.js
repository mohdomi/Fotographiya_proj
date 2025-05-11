import {Router} from 'express';
import User from '../db/schemas/user.js';
import pin_generator from '../random/random.js';
import multer from 'multer';
import {cloudinary} from '../cloudinary/index.js';
import {Readable} from 'stream';
import Category from '../db/schemas/category.js';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// router for updating user pin in db
router.post('/user_pin_update' ,async (req,res)=>{

    const {userId} = req.body;

    const pin = pin_generator();

    const update_result =  await User.findOneAndUpdate({
        _id : userId
    } , {
        pin : pin
    } , {
        new : true
    });

    res.json({
        message : "Updated User Pin",
        update_result

    })

})


// the drop forms name should be images or something of our choice here
router.post('/upload-images', upload.array('images', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'your_folder_name',      // yaha par change karna h folder name to some unqiue thing like categoryId ki folder se
            resource_type: 'image',         
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        Readable.from(file.buffer).pipe(stream);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      message: 'All images uploaded successfully!',
      images: results.map((r) => ({
        url: r.secure_url,
        public_id: r.public_id,
      })),
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});



export default router ;


