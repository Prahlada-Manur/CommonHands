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
    params: (req, file) => {
        const baseFolder = `commonhands/uploads/ngo/${req.userId}`
        let folderPath = baseFolder;
        if (file.fieldname === 'coordinatorAadhaar' || file.fieldname === 'ngoLicense') {
            folderPath = baseFolder
        } else {
            folderPath = `${baseFolder}/tasks`
        }
        return {
            folder: folderPath,
            allowed_formats: ["jgp", 'jpeg', 'png', 'pdf'],
            public_id: `${file.fieldname}-${Date.now()}`
        }
    }
})
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 }
}).fields([
    { name: 'coordinatorAadhaar', maxCount: 1 },
    { name: "ngoLicense", maxCount: 1 },
    { name: 'tasksImages', maxCount: 2 }
])
module.exports = upload;