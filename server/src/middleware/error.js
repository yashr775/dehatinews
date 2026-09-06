import { envMode } from "../../app.js";
const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message =
        statusCode === 500
            ? "Internal server error"
            : err.message || "Something went wrong";

    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {}).join(", ");
        message = `Duplicate field - ${field}`;
        statusCode = 400;
    }

    // Mongoose CastError
    if (err.name === "CastError") {
        const field = err.path || "field";
        message = `Invalid format of ${field}`;
        statusCode = 400;
    }

    const response = {
        success: false,
        message,
    };

    // Detailed errors only in development
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