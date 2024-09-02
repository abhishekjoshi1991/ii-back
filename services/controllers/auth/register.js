const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require("../../../config/db");
const User = db.User;
const Role = db.Role;
const UserRole = db.UserRole;
const jwt = require("jsonwebtoken");
const logWithFunctionName = require('../../../logger/logger');
const registerUser= async (req,res)=>{
    const logger = logWithFunctionName(req.logger, 'Register User');
    const { email, password, user_name } = req.body;
    const transaction = await db.sequelize.transaction();

    try {
        // Check if user exists
        const userExists = await User.findOne({ where: { email: email } });
        if (userExists) {
            return res.status(409).send('User already exists.');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            name: user_name
        }, { transaction });
        logger.debug(`Data to be sent: ${req.body}`);

        const [roleInstance, created] = await Role.findOrCreate({
            where: { role: 'ROLE_USER' },
            defaults: { role: 'ROLE_USER' },
            transaction
        });
        await UserRole.create({
            userId: newUser.idUser,
            roleId: roleInstance.id
        }, { transaction });
        await transaction.commit(); 

        const payload = {
            email: email,
        };


        const token = jwt.sign(payload, process.env.SECRETKEY, { expiresIn: '30d' });
        logger.info(`User Register successfull: ${user_name}`);
        res.status(201).json({ token, name: user_name });
    } catch (err) {
        await transaction.rollback();
        logger.error(`Error While Creating User: ${err.message}`)
        res.status(500).send('Server error');
    }
}
module.exports=registerUser;
