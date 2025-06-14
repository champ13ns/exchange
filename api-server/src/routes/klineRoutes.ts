import { NextFunction, Response, Router } from "express";

const klineRoutes = Router();

klineRoutes.get("/", (req: Request, res: any) => {
  return res.status(200).json({
    message: "Depth Routes working",
  });
});

export { klineRoutes };
