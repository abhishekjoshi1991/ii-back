const jwt = require("jsonwebtoken");
const logWithFunctionName = require('../../logger/logger');
const db = require("../../config/db");
const { where } = require("sequelize");
const User = db.User;
const Role = db.Role;
const UserRole = db.UserRole;
// After importing models

function jwtToken(...requiredRole) {
    return function(req, res, next) {
        const logger = logWithFunctionName(req.logger, "JWT Token Validator");
        const bearerHeader = req.headers['authorization'];
        if (bearerHeader) {
            const bearer = bearerHeader.split(" ");
            const token = bearer[1];
            req.token = token;
            jwt.verify(req.token, process.env.SECRETKEY, async (err, authData) => {
                if (err) {
                    logger.error("Token expired");
                    res.status(403).send({ result: "Token Expired" });
                } else {
                    try {
                        const user = await User.findOne({ 
                            where: { email: authData.email }
                        });
                        // console.log(user.idUser)
                        if (!user) {
                            logger.error("Token is correct but  user not found");
                            return res.status(403).send({ result: "User not found" });
                        }
                        const userRoles = await UserRole.findAll({ 
                            where: { userId: user.idUser },
                        });
                        const roleIds = userRoles.map(userRole => userRole.dataValues.roleId);
                        // console.log(userRoles);
                        const roles = await Role.findAll({
                            where: { id: roleIds }
                        });
                        // console.log("Role IDs for user:", roleIds);

                        const roleNames = roles.map(role => role.dataValues.role); 
                        console.log("Role names for user:", roleNames);
                        const hasRequiredRole = roleNames.some(role => requiredRole.includes(role));
                        // console.log(hasRequiredRole)
                        if (hasRequiredRole) {
                            req.user=user;
                            next();
                        } else {
                            logger.error("User doesn't have permission: " + authData.email);
                            res.status(403).send({ result: "Access Denied. Insufficient Permissions" });
                        }
                    } catch (err) {
                        logger.error("error in jwt Service  " + err.message);
                        console.error(err);
                        res.status(500).send("Server error");
                    }
                }
            });
        } else {
            res.status(401).send({ result: "Token is Not Valid" });
        }
    };
}

module.exports = jwtToken;
