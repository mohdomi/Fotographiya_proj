import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImage(image_path) {
    
    const results = await cloudinary.uploader.upload(
        image_path, 
    );
    
    const url = cloudinary.url(results.public_id , {
        transformation : [
            {
                quality : 'auto' , 
                fetch_format : 'auto'
            }
        ]
    })

    console.log(url);

    return url

};

export {
    uploadImage , cloudinary
}