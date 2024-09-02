// Remove cluster and os modules
require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const imaiLogger = require('./logger/imailogger');
const { v4: uuidv4 } = require('uuid');
let logger = imaiLogger();
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    req.requestId = uuidv4();
    // req.logger = logger.child({ requestId: req.headers['x-request-id'] || 'unknown', path: req.path, method: req.method });
    req.logger = logger.child({ requestId:   req.requestId || 'unknown', path: req.path, method: req.method });
    next();
});
require("./router/web")(app);

const db = require("./config/db");

db.sequelize.sync().then((res) => {
    console.log("---------------------DATABASE CONNECTED------------------------------");
    console.log("Database Host",res.options.host);
    console.log("Database Name",res.config.database);
    console.log("---------------------------------------------------------------------");
    app.listen(process.env.PORT||3000, '0.0.0.0',async () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch(err => {
    console.log("---------------------------------------------------------------------");
    console.error("Database Is Not Connected ");
    console.error("Failed to sync database: ", err);
    process.exit(1); 
});