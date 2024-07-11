import { error } from "console";
import { NextFunction } from "express";

const asyncHandler = (requestHandler: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, req, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };
