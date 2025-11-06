const cloudinary = require('cloudinary');
const deleteNgoFolder = async (userId) => {
    try {
        if (!userId) {
            return "User id not provided"
        }
        const ngoPath = `commonhands/uploads/ngo/${userId}`;
        await cloudinary.api.delete_resources_by_prefix(ngoPath);
        await cloudinary.api.delete_folder(ngoPath);
        console.log(`Deleted folder ${ngoPath}`);
    } catch (err) {
        console.log(err.message);
    }

}

module.exports = {deleteNgoFolder}