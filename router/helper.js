const multer = require('multer');
const path = require('path');
const fs = require('fs');

function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log(file)
        let uploadPath = 'uploads/';
        if (file.fieldname === 'emails') {
            uploadPath += 'emails/';
        } else if(file.fieldname === 'readdata'){
            uploadPath += 'readdata/';
        }

        ensureDirExists(uploadPath);
        cb(null, uploadPath); 
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
module.exports = {
    upload
};