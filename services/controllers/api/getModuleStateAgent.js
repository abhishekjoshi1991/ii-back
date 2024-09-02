const http = require('http');
const fs = require('fs');
const path = require('path');
const logWithFunctionName = require('../../../logger/logger');
const getModuleStateAgent = async (req, res) => {
    const logger = logWithFunctionName(req.logger, 'getModuleStateAgent');
    try {
        let email_data;
        var filePath;
        if (req.file) {
            logger.info("Request recived with file from " + req.user.dataValues.email);
            filePath = req.file.path;
            const fileExt = path.extname(filePath).toLowerCase();

            if (fileExt !== '.txt' && fileExt !== '.eml') {
                logger.error("Invalid file type. Only .txt and .eml files are allowed.")
                return res.status(400).send('Invalid file type. Only .txt and .eml files are allowed.');
            }

            // const fileContents = fs.readFileSync(filePath, 'utf8');
            const fileContents = await fs.promises.readFile(filePath, 'utf8');
            email_data = fileContents;
        } else {
            logger.info("Request recived text from " + req.user.dataValues.email);
            email_data = req.body.email;
        }

        const data = JSON.stringify({
            email_text: email_data,
            user: req.user.dataValues.email
        });

        const options = {
            hostname: process.env.SERVER_HOST || '127.0.0.1',
            port: process.env.SERVER_PORT || 7030,
            path: '/imai_app/get_ModuleStateAgent',
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
                if (filePath) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            logger.error(`Error deleting file: ${err.message}`);
                            console.error('Error deleting file:', err);
                        } else {
                            logger.info(`Successfully deleted file: ${filePath}`);
                            console.log('Successfully deleted file:', filePath);
                        }
                    });
                }
            });

        });
        request.on('error', error => {
            logger.error(`Request Error: ${error.message}`);
            if (error.message) {
                res.status(500).send(error.message);
            } else {
                res.status(500).send("An error occurred while processing request");
            }
        });

        request.write(data);
        request.end();
    } catch (error) {
        if (filePath) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    logger.error(`Error deleting file: ${err.message}`);
                    console.error('Error deleting file:', err);
                } else {
                    logger.info(`Successfully deleted file: ${filePath}`);
                    console.log('Successfully deleted file:', filePath);
                }
            });
        }
        logger.error(`Error in emailData function: ${error.message}`);
        console.error('Error:', error.message);
        res.status(500).send('An error occurred');
    }
};

module.exports = getModuleStateAgent;
