import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/appError";

export const errorHandler:ErrorRequestHandler = (err, req, res, next): any => {

  console.error(`Error Occured on PATH: ${req.path}`, err);

  if(err instanceof SyntaxError){
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid Json Syntax",
      error: err.message,
    })
  }
  
  if(err instanceof AppError){
    return res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode, 
    });
  }
  
  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: err?.message || "Unknown Error Occurred",
  })
}

export default errorHandler;