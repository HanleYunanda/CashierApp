const multer = require('multer');
const path = require('path');

// Define storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/'); // Define the folder where the file will be saved
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get file extension
        cb(null, 'product-' + Date.now() + ext); // Create a unique filename
    },
});

// Define file filter for validating image types
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true); // Accept the file
    } else {
        return cb(new Error('Only image files (jpeg, jpg, png) are allowed.'));
    }
};

// Define multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (e.g., 5 MB)
});

module.exports = upload