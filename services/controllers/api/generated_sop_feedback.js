const http = require("http");
const logWithFunctionName = require("../../../logger/logger");
const Joi = require("joi");

// Define the schema for input validation
const feedbackSchema = Joi.object({
  project: Joi.string().required(),
  agent: Joi.string().required(),
  module: Joi.string().required(),
  state: Joi.string().required(),
  generated_sop: Joi.string().required(),
  customer_specific_sop: Joi.string().allow("").optional(),
  modified_generated_sop: Joi.string().allow("").optional(),
  modified_customer_specific_sop: Joi.string().allow("").optional(),
  feedback: Joi.string().allow("").optional(),
});

const generatedSOPFeedback = async (req, res) => {
  const logger = logWithFunctionName(req.logger, "generatedSOPFeedback");
  // Validate the input data
  const { error } = feedbackSchema.validate(req.body);
  if (error) {
    logger.error(`Validation Error: ${error.message}`);
    return res
      .status(400)
      .send(`Invalid input data: ${error.details[0].message}`);
  }

  try {
    const data = JSON.stringify({
      module: req.body.module,
      state: req.body.state,
      agent: req.body.agent,
      project: req.body.project,
      user_email: req.user.dataValues.email,
      generated_sop: req.body.generated_sop,
      modified_generated_sop: req.body.modified_generated_sop,
      customer_specific_sop: req.body.customer_specific_sop,
      modified_customer_specific_sop:req.body.modified_customer_specific_sop,
      feedback: req.body.feedback,
    });

    logger.debug(`Data to be sent: ${data}`);

    const options = {
      hostname: process.env.SERVER_HOST || "127.0.0.1",
      port: process.env.SERVER_PORT || 7030,
      path: "/imai_app/log_sop_feedback",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };
    const request = http.request(options, (response) => {
      let responseData = "";

      response.on("data", (chunk) => {
        responseData += chunk;
      });

      response.on("end", () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          logger.info(`Request successful for ${req.user.dataValues.email}`);
          res.status(response.statusCode).send(responseData);
        } else {
          logger.error(
            `Request failed with status code: ${response.statusCode}`
          );
          res.status(response.statusCode).send(responseData);
        }
      });
    });

    request.on("error", (error) => {
      logger.error(`Request Error: ${error.message}`);
      
      if(error.message){
        res.status(500).send(error?.message);
        }else{
          res.status(500).send("An error occurred while processing your request");
        }
    });

    request.write(data);
    request.end();
  } catch (error) {
    logger.error(`Error in generatedSOPFeedback function: ${error.message}`);
    if(error.message){
    res.status(500).send(error.message);
    }else{
      res.status(500).send("An error occurred while processing your request");
    }
  }
};

module.exports = generatedSOPFeedback;
