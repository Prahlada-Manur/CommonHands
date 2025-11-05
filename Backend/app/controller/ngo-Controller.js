const OrganizationProfile = require('../model/organizationProfile-Schema');
const User = require('../model/user-Schema');
const { ngoRegisterationValidation, ngoUpdateValidation } = require('../validations/user-Validation')
const bcryptjs = require('bcryptjs');
const Task = require('../model/task-Schema')
const cloudinary = require('cloudinary').v2;
const { deleteNgoFolder } = require('../utils/cloudinaryHelper')
const ngoCltr = {};
//--------------------------------------------------------------------------------------------------------------
//------------------------------------------NGO Registration----------------------------------------------------
ngoCltr.register = async (req, res) => {
    const body = req.body;
    try {
        const { error, value } = ngoRegisterationValidation.validate(body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ error: error.details })
        }
        const checkEmail = await User.findOne({ email: value.email });
        if (checkEmail) {
            return res.status(400).json({ error: "NGO already registerd with this email" })
        }
        const checkRegNumber = await OrganizationProfile.findOne({ regNumber: value.regNumber })
        if (checkRegNumber) {
            return res.status(400).json({ error: "NGO with this registeration Number already exists" })
        }
        const user = new User({ ...value, role: "NGO" });
        const salt = await bcryptjs.genSalt()
        const hash = await bcryptjs.hash(user.password, salt);
        user.password = hash
        const organizationProfile = new OrganizationProfile({ ...value, user: user._id })
        await user.save();
        await organizationProfile.save();
        console.log(`NGO registered successfully with email: ${user.email}`);
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json({ message: "NGO Profile Created login and upload Documnets", user: userResponse, organizationProfile })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
//-------------------------------------API to Upload Documents---------------------------------------------------------
ngoCltr.uploadDoc = async (req, res) => {

    console.log('fies recived', req.files);
    try {
        if (
            !req.files ||
            !req.files.coordinatorAadhaar?.[0] ||
            !req.files.ngoLicense?.[0]
        ) {
            return res.status(400).json({ error: 'Upload the required files for Verification' })
        }
        const ngoProfile = await OrganizationProfile.findById(req.ngoId);
        if (!ngoProfile) {
            return res.status(404).json({ error: 'NGO Profile not Found' })
        }
        const aadhaarFiles = req.files.coordinatorAadhaar;
        const licenseFiles = req.files.ngoLicense;
        ngoProfile.coordinatorAadhaarUrl = aadhaarFiles[0].path;
        ngoProfile.ngoLicenseUrl = licenseFiles[0].path;
        await ngoProfile.save();
        res.status(200).json({ message: 'Documents uploaded successfully', ngoProfile })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
//-----------------------------------------API for Admin to verify NGO-----------------------------------------
ngoCltr.VerifyNgo = async (req, res) => {
    const ngoId = req.params.id;
    const body = req.body;
    try {
        if (!["Verified", "Rejected"].includes(body.status)) {
            return res.status(400).json({ error: "Invalid status value" })
        }
        if (body.status === "Rejected" && !body.reason) {
            return res.status(400).json({ error: "Reason is required for rejection" })
        }
        const updateData = { status: body.status };
        if (body.status === "Rejected") {
            updateData.reason = body.reason;
        }
        const updateNgo = await OrganizationProfile.findByIdAndUpdate(ngoId, updateData, { new: true }).populate('user', ['firstName', 'email'])
        if (!updateNgo) {
            return res.status(404).json({ error: "NGO Profile not found" })
        }
        res.status(200).json({ message: "NGO Status is Updated", updateNgo })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
//-----------------------------------------API to get NGO Profile-----------------------------------------
ngoCltr.ngoProfile = async (req, res) => {
    // const id=req.params.id
    try {
        const ngoProfile = await OrganizationProfile.findById(req.ngoId).populate('user', ['firstName', 'lastName', 'email'])
        if (!ngoProfile) {
            return res.status(404).json({ error: "NGO Profile not found" })
        }
        res.status(200).json(ngoProfile)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
//------------------------------------------API for NGO Profile Update--------------------------------------------
ngoCltr.updateNgo = async (req, res) => {

    const body = req.body;
    const { error, value } = ngoUpdateValidation.validate(body, { abortEarly: false })
    if (error) {
        return res.status(400).json({ message: "Validation Error", error: error.details })
    }
    const updateValue = {
        ngoName: value.ngoName,
        regNumber: value.regNumber,
        contactEmail: value.contactEmail
    }
    try {
        const updateNgo = await OrganizationProfile.findOneAndUpdate({ _id: req.ngoId, user: req.userId }, updateValue, { new: true, runValidators: true })
        if (!updateNgo) {
            return res.status(404).json({ error: "User not Found" })
        }
        res.status(200).json({ message: "NGO Profile Updated Successfully", updateNgo })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server Error" })

    }
}
//------------------------------------API for deleting NGO and User linked to it-----------------------------------------------
ngoCltr.delete = async (req, res) => {
    try {
        const tasks = await Task.find({ ngo: req.ngoId })
        if (tasks.length > 0) {
            for (let task of tasks) {
                if (task.images && task.images.length > 0) {
                    for (let img of task.images) {
                        if (img.public_id) {
                            try {
                                await cloudinary.uploader.destroy(img.public_id)
                                console.log(`Image Deleted ${img.public_id}`);

                            } catch (cloudErr) {
                                console.error('Image deletion failed')
                            }
                        }
                    }
                }
            }
        }
        await Task.deleteMany({ ngo: req.ngoId })
        console.log(`Deleted the task related to ${req.ngoId}`);
        //helper function to delete the ngo file conataining pic in cloudinary 
        await deleteNgoFolder(req.userId)
        //----------------------------------------------------------------------
        const deleteNgoProfile = await OrganizationProfile.findOneAndDelete({ _id: req.ngoId, user: req.userId });
        if (!deleteNgoProfile) {
            return res.status(404).json({ error: "Profile not found" })
        }

        const deleteNgoUser = await User.findByIdAndDelete(req.userId)
        if (!deleteNgoProfile || !deleteNgoUser) {
            return res.status(404).json({ error: "User not found" })
        }


        res.status(200).json({ message: "Successfully deleted the user and its tasks", deleteNgoProfile, deleteNgoUser })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//------------------------------------API to list all the NGOS-----------------------------------------------------------------
ngoCltr.list = async (req, res) => {
    try {
        const ngoList = await OrganizationProfile.find().populate('user', ['firstName', 'lastName', 'email'])
        res.status(200).json({ message: 'List of all the Ngo with there users', ngoList })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })
    }
}
ngoCltr.deleteByAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const tasks = await Task.find({ ngo: id })
        if (tasks.length > 0) {
            for (let task of tasks) {
                if (task.images && task.images.length > 0) {
                    for (let img of task.images) {
                        if (img.public_id) {
                            try {
                                await cloudinary.uploader.destroy(img.public_id)
                                console.log(`Image Deleted ${img.public_id}`);

                            } catch (cloudErr) {
                                console.error('Image deletion failed')
                            }
                        }
                    }
                }
            }
        }
        await Task.deleteMany({ ngo: id })
        console.log(`Deleted task related to ngo${id}`);
        await deleteNgoFolder(ngoToDelete.user)
        const ngoToDelete = await OrganizationProfile.findByIdAndDelete(id);
        if (!ngoToDelete) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        const deletedUser = await User.findByIdAndDelete(ngoToDelete.user);
        res.status(200).json({
            message: 'NGO,tasks and linked user deleted successfully by Admin',
            deletedNgo: ngoToDelete,
            deletedUser: deletedUser
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = ngoCltr