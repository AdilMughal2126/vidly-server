import { NextFunction, Request, Response } from "express";

export const asyncMiddleware =
  (
    handler: (
      req: Request,
      res: Response
    ) => Promise<Response<unknown, Record<string, unknown>>>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await handler(req, res);
    } catch (err) {
      return next(err);
    }
  };
