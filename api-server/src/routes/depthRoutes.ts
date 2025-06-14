import { NextFunction, Response, Router } from "express";

const depthRoutes = Router();

depthRoutes.get("/", (req: Request, res: any) => {
  return res.status(200).json({
    message: "Depth Routes working",
  });
});

export { depthRoutes };
