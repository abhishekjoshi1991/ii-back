const axios = require("axios");
const logWithFunctionName = require("../../../logger/logger");

const deleteSopFromDB = async (req, res) => {
  const logger = logWithFunctionName(req.logger, "deleteSopFromDB");
  try {
    const page_number = req.params.page_number;
    console.log("Received page_number:", page_number);

    if (!page_number) {
      logger.error("Page number is missing");
      return res.status(400).send("Page number is required");
    }
    const data = {
      page_number: parseInt(page_number),
    };

    const response = await axios.post(
      `http://${process.env.SERVER_HOST || "127.0.0.1"}:${
        process.env.SERVER_PORT || 7030
      }/imai_app/remove_sop`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      logger.info(`Request successful for ${req.user.dataValues.email}`);
      res.send(response.data);
    } else {
      
      logger.error(`Request failed with status code ${response.status}`);
      res.status(response.status).send("An error occurred");
    }
  } catch (error) {
    if (error.response) {
      logger.error(`Request failed with status code ${error.response.status}`);
      res.status(error.response.status).send(error.response.data?.message);
    } else if (error.request) {
      logger.error(`No response received: ${error.message}`);
      res.status(500).send("No response received from server");
    } else {
      logger.error(`Error in deleteSopFromDB function: ${error.message}`);
      res.status(500).send("An error occurred");
    }
  }
};

module.exports = deleteSopFromDB;
