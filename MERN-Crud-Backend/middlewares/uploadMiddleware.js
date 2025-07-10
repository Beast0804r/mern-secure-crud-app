const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = 'uploads'

if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, uploadPath);
    },
    filename:(req, file, cb) =>{
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`)
    }
});

const uploads = multer({ storage });

module.exports = uploads;