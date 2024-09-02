const http = require('http');
const fs = require('fs');
const path = require('path'); 
const logWithFunctionName = require('../../../logger/logger');
const emailData = async (req, res) => {
    const logger = logWithFunctionName(req.logger, 'emailData and Get Sop services email data pass');
    try {
        let email_data;
        let filePath;
        if(req.file){
            logger.info("Request recived with file from " +req.user.dataValues.email);
            filePath = req.file.path; 
            const fileExt = path.extname(filePath).toLowerCase(); 

            if (fileExt !== '.txt' && fileExt !== '.eml') {
                return res.status(400).send('Invalid file type. Only .txt and .eml files are allowed.');
            }
            
            const fileContents = fs.readFileSync(filePath, 'utf8');
            email_data = fileContents;
        }else{
            logger.info("Request recived text from " +req.user.dataValues.email);
            email_data = req.body.email;
        }

        const data = JSON.stringify({
            email_text: email_data,
            user:req.user.dataValues.email
        });
        logger.debug(`Data to be sent: ${data}`);

        const options = {
            hostname: process.env.SERVER_HOST || '127.0.0.1',
            port: process.env.SERVER_PORT || 7030,
            path: '/imai_app/extract_email_data',
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
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    
                    logger.info(`Request successful for ${req.user.dataValues.email}`,`Get database Sop`);
                    res.status(response.statusCode).send(responseData);

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
                // Create json file of response if need uncomment below code
                // try {
                //     const parsedData = JSON.parse(responseData);
                //     const timestamp = Date.now();
                //     const jsonFileName = `response-${timestamp}.json`;
                //     const jsonFilePath = path.join(__dirname, jsonFileName);

                //     fs.writeFile(jsonFilePath, JSON.stringify(parsedData, null, 2), 'utf8', (err) => {
                //         if (err) {
                //             console.error('Error writing to file:', err);
                //         } else {
                //             console.log('Response data saved to:', jsonFilePath);
                //         }
                //     });
                // } catch (parseError) {
                //     console.error('Error parsing JSON:', parseError);
                //     res.status(500).send('Error parsing response data');
                // }
            }else {
                logger.error(`Request failed with status code ${response.statusCode} `);
                res.status(response.statusCode).send('An error occurred while processing your request');
            }

            });

        });
        request.on('error', error => {
            logger.error(`Request Error: ${error.message}`);
            console.error('Request Error:', error.message);
            if(error.message){
                res.status(500).send(error?.message);
                }else{
                  res.status(500).send("An error occurred while processing your request");
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

module.exports = emailData;
