const logWithFunctionName = (logger, functionName) => {
    return {
        info: (message, meta) => logger.info(message, { ...meta, functionName }),
        error: (message, meta) => logger.error(message, { ...meta, functionName }),
        debug: (message, meta) => logger.debug(message, { ...meta, functionName }),
        // Add other log levels if needed
    };
}

module.exports = logWithFunctionName;