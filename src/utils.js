import multer from 'multer';
import { resolve } from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${resolve('./src/public/images')}`)
    },
    filename: (req,file,cb) => {
        console.log(file);
        cb(null, `${Date.now()}---${file.originalname}`)
    }
})

export const uploader = multer({storage})