const http = require('http'); 
const logWithFunctionName = require('../../../logger/logger');
const validateProjectInput = (project) => {
    return typeof project === 'string' && project.trim().length > 0;
};
const getProjectSpecificLevel = async (req, res) => {
    const logger = logWithFunctionName(req.logger, 'getModuleStateAgent');
   console.log(req.user.dataValues.email)
    try {
        const project = req.body.project;
        if (!validateProjectInput(project)) {
            logger.warn('Invalid project input');
            return res.status(400).send('Invalid project input');
        }
        const data = JSON.stringify({
            identifier: project,
        });

        const options = {
            hostname: process.env.SERVER_HOST || '127.0.0.1',
            port: process.env.SERVER_PORT || 7030,
            path: '/imai_app/project_specific_level',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            },
        };
        
        const request = http.request(options, response => {
            let responseData = '';

            response.on('data', chunk => {
                responseData += chunk;
            });
            response.on('end', () => {
                logger.info(`Successfully Send response:Module State Agent`);
                res.status(response.statusCode).send(responseData);
                // res.send(responseData);
            });

        });
        request.on('error', error => {
            logger.error(`Request Error: ${error.message}`);
            if(error.message){
                res.status(500).send(error.message);
                }else{
                  res.status(500).send("An error occurred while processing request");
                }
        });

        request.write(data);
        request.end();
    } catch (error) {
        logger.error(`Error in emailData function: ${error.message}`);
        console.error('Error:', error.message);
        res.status(500).send('An error occurred');
    }
};

module.exports = getProjectSpecificLevel;
