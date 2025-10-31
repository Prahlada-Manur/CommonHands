//this middleware is for Authorization Puropose

const authorizeUser = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.role)) {
            next();
        } else {
            return res.status(403).json({ error: "You are not authorized to access this resource" });
        }
    }
}
module.exports = authorizeUser;