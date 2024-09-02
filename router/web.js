const registerUser = require("../services/controllers/auth/register");
const loginUser = require("../services/controllers/auth/login");
const jwtToken = require("../services/middlewares/jwtService");
const emailData = require("../services/controllers/api/email_data_pass");
const { upload } = require('./helper');
const db = require("../config/db");
const fs = require('fs');
const getModuleStateAgent = require("../services/controllers/api/getModuleStateAgent");
const passValidateData = require("../services/controllers/api/passValidateData");
const genratedApi = require("../services/controllers/api/genrated_api");
const deleteSopFromDB = require("../services/controllers/api/delete_SOP_from_vector_db");
const generatedSOPFeedback = require("../services/controllers/api/generated_sop_feedback");
const getProjectSpecificLevel = require("../services/controllers/api/get_projectspecific_level");

function initRoutes(app) {
    app.post('/api/v1/pass_email_data',jwtToken("ROLE_USER"),upload.single('emails'),emailData);
    app.post('/api/v1/pass_validate_data',jwtToken("ROLE_USER"),passValidateData);
    app.post('/api/v1/sendmoduledata',jwtToken("ROLE_USER"),upload.single('emails'),getModuleStateAgent);
    app.post('/api/v1/genratedsop',jwtToken("ROLE_USER"),genratedApi);
    app.post('/api/v1/get_project_specific_level',jwtToken("ROLE_USER"),getProjectSpecificLevel);
    app.delete('/api/v1/delete_sop_api/:page_number',jwtToken("ROLE_USER"),deleteSopFromDB);
    app.post('/api/v1/generated_sop_feedback',jwtToken("ROLE_USER"),generatedSOPFeedback);
    app.post('/api/v1/auth/signup', registerUser);
    app.post('/api/v1/auth/login', loginUser);
}

module.exports = initRoutes;
