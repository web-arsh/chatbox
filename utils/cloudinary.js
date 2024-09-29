import {CloudinaryStorage} from "multer-storage-cloudinary";
import { v2 as cloudinary } from 'cloudinary';

// Configuration

cloudinary.config({ 
    cloud_name: 'dgmfnfvf9', 
    api_key: '142568998493883', 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});

const storage1 = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "chatbox",
        asset_folder: (req)=> `chatbox/${req.user}`,
        resource_type: "auto",
        type: "authenticated",    
        public_id: (req,file) => file.originalname
    }
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "chatbox",
        allowed_formats: ["jpg","png","jpeg"],
        asset_folder: (req)=> `chatbox/${req.user}`,
        type: "authenticated",    
        transformation: [{width: 100,height: 100,quality: "auto",effect: "sharpen:150",crop: "auto", fetch_format: 'auto'},{radius: "max"}],
    }
});


export {storage,storage1}