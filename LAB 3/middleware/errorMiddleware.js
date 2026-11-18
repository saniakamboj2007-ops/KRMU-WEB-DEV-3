const errorHandler = (err, req, res, next) => {

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    if (err.name === "ValidationError") {
        statusCode = 400;
    }

    if (err.code === 11000) {
        statusCode = 400;
        err.message = "SKU already exists";
    }

    if (err.name === "CastError") {
        statusCode = 400;
        err.message = "Invalid ID";
    }

    res.status(statusCode).json({
        success: false,
        message: err.message
    });
};

module.exports = errorHandler;