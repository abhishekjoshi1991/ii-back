const db = require("../../../config/db");
const User = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logWithFunctionName = require("../../../logger/logger");
const loginUser = async (req, res) => {
  const logger = logWithFunctionName(req.logger, "Login User");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });

    if (user === null) {
      logger.error(`User Not Found ${email}`);
      return res.status(404).send("User not found.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.error(`User Password Not match ${user.email}`);
      return res.status(401).send("Invalid credentials.");
    }
    const payload = {
      email: email,
    };
    logger.info(`User Sign In ${user.email}`);
    const token = jwt.sign(payload, process.env.SECRETKEY, {
      expiresIn: "30d",
    });
    res.status(200).json({ token, name: user.name });
  } catch (err) {
    logger.error(`Error While Sign In User: ${err.message}`);
    res.status(500).send("Server error");
  }
};
module.exports = loginUser;
