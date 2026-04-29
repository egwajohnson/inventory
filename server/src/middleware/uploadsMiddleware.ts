import { NextFunction, Request, Response } from "express";

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hasSingleFile = req.file?.path;
  const hasMultipleFiles =
    Array.isArray(req.files) && req.files.length > 0;

  if (!hasSingleFile && !hasMultipleFiles) {
    return res.status(400).json({
      message: "Please upload at least one file",
    });
  }

  next();
};

