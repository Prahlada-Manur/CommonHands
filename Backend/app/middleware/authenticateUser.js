//this file is for Authentication middleware
const jwt = require('jsonwebtoken');
const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: " No token provided" });
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = tokenData.userId;
        req.role = tokenData.role;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
module.exports = authenticateUser;