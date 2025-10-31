
const User = require('../model/user-Schema')
const { registerValidation, loginValidation } = require('../validations/user-Validation')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userCltr = {};

//-------------------------------------------------------------------------------------------------------------
//----------------------------------------User Registration----------------------------------------------------
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
//----------------------------------------User Login------------------------------------------------------

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

        const tokenData = { userId: user._id, role: user.role };
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
//----------------------------------------------------------------------------------------------
module.exports = userCltr