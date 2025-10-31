const OrganizationProfile = require('../model/organizationProfile-Schema');
const User = require('../model/user-Schema');
const { ngoRegisterationValidation } = require('../validations/user-Validation')
const bcryptjs = require('bcryptjs');
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
    const ngoId = req.userId;
    console.log(req.files);
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'Upload the required files for Verification' })
        }
        const ngoProfile = await OrganizationProfile.findOne({ user: ngoId });
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
        const updateNgo = await OrganizationProfile.findByIdAndUpdate(ngoId, updateData, { new: true }).populate('user', ['firstname', 'email'])
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
        const ngoProfile = await OrganizationProfile.findOne({ user: req.userId }).populate('user', ['firstName', 'lastname', 'email'])
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
module.exports = ngoCltr