const http = require('http');
const fs = require('fs');
const path = require('path'); 
const logWithFunctionName = require('../../../logger/logger');
const { Json } = require('sequelize/lib/utils');
const genratedApi = async (req, res) => {
    const logger = logWithFunctionName(req.logger, 'genratedApi');
    try {
        const data = JSON.stringify({
            agent:req.body.agent,
            identifier: req.body.project,
            module:req.body.module,
            state:req.body.state,
            customer_specific:req.body.customer_specific,
            level:req.body.level
        });
        console.log(JSON.parse(data))
        logger.info(`level: ${req.body.level}`)
        logger.debug(`Data to be sent: ${data}`);
        const options = {
            hostname: process.env.SERVER_HOST || '127.0.0.1',
            port: process.env.SERVER_PORT || 7030,
            path: '/imai_app/generate_sop_by_parameters',
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
                logger.info(`Request successful for ${req.user.email}`);
                res.status(response.statusCode).send(responseData);
                // res.send(responseData);
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

            });

        });
        request.on('error', error => {
            logger.error(`Request Error: ${error.message}`);
            console.error('Request Error:', error.message);
            // res.status(500).send('An error occurred');
            if(error.message){
                res.status(500).send(error.message);
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

module.exports = genratedApi;
