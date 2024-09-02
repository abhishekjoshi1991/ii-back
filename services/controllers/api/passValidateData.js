const http = require('http');
const logWithFunctionName = require('../../../logger/logger');
const passValidateData = async (req, res) => {
    const logger = logWithFunctionName(req.logger, 'passValidateData send correct or incorrect data');
    const{page_number,generated_sop,correct_sop,module,state,agent,prepared_query,sop_type,project}=req.body;
    try {
        const data = JSON.stringify({
            page_number,
             generated_sop,
            correct_sop,
            module,
            state,
            agent,
            prepared_query,
            project,
            sop_type,
            "user_email":req.user.dataValues.email
        });
        logger.debug(`Data to be sent: ${data}`);
        console.log(req.body)
        const options = {
            hostname: process.env.SERVER_HOST || '127.0.0.1',
            port: process.env.SERVER_PORT || 7030,
            path: '/imai_app/get_correct_SOP',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            },
            timeout: 600000,
        };

        const request = http.request(options, response => {
            let responseData = '';

            response.on('data', chunk => {
                responseData += chunk;
            });
            response.on('end', () => {
                logger.info(`Request successful for ${req.user.dataValues.email}`);
                res.send(responseData);
            });

        });
        request.on('error', error => {
            logger.error('Request error while sending to python passValidate data:', error.message);

            if(error.message){
                res.status(500).send(error?.message);
                }else{
                  res.status(500).send("An error occurred while processing your request");
                }
        });

        request.write(data);
        request.end();
    } catch (error) {
        logger.error(`Error in passValidate Data function: ${error.message}`);
        console.error('Error:', error.message);
        res.status(500).send('An error occurred');
    }
};

module.exports = passValidateData;
