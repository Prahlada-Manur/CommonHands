
const OrganizationProfile = require('../model/organizationProfile-Schema');
const User = require('../model/user-Schema')
const { registerValidation, loginValidation, userUpdateValidation, ngoRegisterationValidation } = require('../validations/user-Validation')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userCltr = {};

//-------------------------------------------------------------------------------------------------------------------
//----------------------------------------User Registration-----------------------------------------------------------
userCltr.register = async (req, res) => {
    const body = req.body;
    try {
        const { error, value } = registerValidation.validate(body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ error: error.details })
        }

        const checkEmail = await User.findOne({ email: value.email })
        if (checkEmail) {
            return res.status(400).json({ error: "Email already exists" })
        }

        const userCount = await User.countDocuments();
        const roleAssign = (userCount === 0) ? "Admin" : "Contributor";
        if (userCount === 0) {
            console.log("First user detected and user is set to admin");

        }
        const user = new User({ ...value, role: roleAssign, password: value.password })
        const salt = await bcryptjs.genSalt();
        const hash = await bcryptjs.hash(user.password, salt);
        user.password = hash;
        await user.save();
        console.log(`User ${user.email} saved successfully with role ${user.role}`);
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json(userResponse)

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//----------------------------------------User Login-------------------------------------------------------------------
userCltr.login = async (req, res) => {
    const body = req.body;
    const { error, value } = loginValidation.validate(body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details })
    }
    try {
        const user = await User.findOne({ email: value.email })
        if (!user) {
            return res.status(404).json({ error: "User Not found" })
        }
        const isMatch = await bcryptjs.compare(value.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        if (value.location?.lat && value.location?.long) {
            user.location = {
                lat: value.location.lat,
                long: value.location.long
            };
        }

        user.loginCount += 1;
        await user.save();
        console.log(`User ${user.email} logged in successfully`);
        let ngoId = null;
        if (user.role === 'NGO') {
            const ngoProfile = await OrganizationProfile.findOne({ user: user._id })
            if (ngoProfile) {
                ngoId = ngoProfile._id
            }
        }
        const tokenData = { userId: user._id, role: user.role, ngoId };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token: token })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//------------------------------------------API to show user Profile----------------------------------------------------
userCltr.show = async (req, res) => {
    const userId = req.userId;
    try {
        const profile = await User.findById(userId)
        res.status(200).json(profile)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//----------------------------------------------------API to Update the userData-------------------------------------------------------------------
userCltr.updateUser = async (req, res) => {
    const body = req.body;
    const { error, value } = userUpdateValidation.validate(body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: "validation Error", error: error.details })
    }
    const updateValue = {
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        mobileNumber: value.mobileNumber
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.userId, updateValue, { new: true })
        if (!updateUser) {
            return res.status(404).json({ error: 'User not found or Unauthorized' })
        }
        res.status(200).json({ message: 'User updated successfully', user: updateUser })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })
    }
}
//--------------------------------------------------API to delete User----------------------------------------------------
userCltr.delete = async (req, res) => {
    const id = req.params.id;
    try {
        if (req.role !== 'Admin' && String(req.userId) !== String(id)) {
            return res.status(403).json({ error: 'You are not authorized' })
        }
        const deleteUser = await User.findByIdAndDelete({ _id: id })
        if (!deleteUser) {
            return res.status(404).json({ error: "User Not Found" })
        }
        res.status(200).json({ message: "Successfully deleted the User", deleteUser })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" })

    }
}
//-----------------------------------------------API to show all the user to Admin--------------------------------------------
userCltr.list = async (req, res) => {
    try {
        const listUsers = await User.find();
        res.status(200).json({ message: "List of all the users", listUsers })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//--------------------------------------------------------------------------------------------------------------------------

module.exports = userCltr