import {apiError} from "../utils/apiError.js"

export const errorHandler = (err, req, res, next) => {
    let error = err

    if(!(error instanceof apiError)){
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        error = new apiError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
}