import { NextFunction, Response, Router } from "express";

const tradeRoutes = Router();

tradeRoutes.get("/", (req: Request, res: any) => {
  return res.status(200).json({
    message: "Depth Routes working",
  });
});

export { tradeRoutes };
