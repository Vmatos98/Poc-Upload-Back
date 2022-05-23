import express from 'express';  
import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from  'multer-s3'
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const app = express().use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    app.use(cors());
    next();
});

aws.config.update({
    accessKeyId:"AKIAUPJTSIUPJL5K5FYU",
    secretAccessKey: "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",
    region:"sa-east-1",
})

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3,
        bucket:'poc-upload-driven',
        ack:'public-read',
        key(req, file, callback){
            callback(null, uuidv4() + path.extname(file.originalname))
        }
    })
})

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename)

// const upload = multer({
//     dest:'./uploads',
// })
// const upload = multer({
//     storage: multer.diskStorage({
//         destination:path.resolve(__dirname,'../uploads'),
//         filename:(req,file,callback)=>callback(null, uuidv4() + path.extname(file.originalname))
//     })
// })





app.post('/uploads', upload.single("image"), (req,res)=>{
    console.log("imagem recebida")
    console.log(req.file)
    res.send("Sucesso").status(200);
})


app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});