//---------------------------------------Cloudinary Upload Middleware---------------------------------------
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

//------------------------------------------------Cloudinary Configuration------------------------------------------------
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
//------------------------------------------------Multer Storage Configuration------------------------------------------------
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: (req, file) => {
            console.log(`uploading file for NGO with user ID ${req.userId}`);
            return `commanhands/uploads/ngo-registrations/${req.userId}`;
        },
        allowed_formats: ['jpg', 'png', 'pdf', 'jpeg'],
        public_id: (req, file) => {
            return file.fieldname;
        }
    }
})
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }
}).fields([
    { name: 'coordinatorAadhaar', maxCount: 1 },
    { name: "ngoLicense", maxCount: 1 }
])
module.exports = upload;