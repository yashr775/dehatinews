import { envMode } from "../../app.js";

const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = "Internal server error";

    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {}).join(", ");

        message = field
            ? `Duplicate field - ${field}`
            : "Duplicate value";

        statusCode = 400;
    }

    // Mongoose CastError
    else if (err.name === "CastError") {
        const field = err.path || "field";

        message = `Invalid format of ${field}`;
        statusCode = 400;
    }

    // Mongoose validation error
    else if (err.name === "ValidationError") {
        message = "Invalid input data";
        statusCode = 400;
    }

    // Log complete error details on the server
    console.error("Application Error:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
        statusCode,
        method: req.method,
        url: req.originalUrl,
    });

    const response = {
        success: false,
        message,
    };

    // Detailed information ONLY during development
    if (envMode === "DEVELOPMENT") {
        response.error = {
            name: err.name,
            message: err.message,
            stack: err.stack,
        };
    }

    return res.status(statusCode).json(response);
};

const TryCatch = (passedFunction) => async (req, res, next) => {
    try {
        await passedFunction(req, res, next);
    } catch (error) {
        next(error);
    }
};

export { errorMiddleware, TryCatch };