import { NextFunction, Response, Router } from "express";

const tickerRoutes = Router();

tickerRoutes.get("/", (req: Request, res: any) => {
  return res.status(200).json({
    message: "Depth Routes working",
  });
});

export { tickerRoutes };
