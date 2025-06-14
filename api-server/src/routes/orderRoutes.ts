import { NextFunction, Response, Router } from "express";
import { RedisManager } from "../types/RedisManager";
import { CREATE_ORDER } from "../types";

const orderRoutes = Router();

orderRoutes.get("/", (req: Request, res: any) => {
  return res.status(200).json({
    message: "Depth Routes working",
  });
});

orderRoutes.post("/", async (req, res: any) => {
  const { market, price, quantity, side, userId } = req.body;
  const response = await RedisManager.getInstance().sendAndAwait({
    type: CREATE_ORDER,
    data: {
      market,
      side,
      price,
      quantity,
      userId,
    },
  });
  return res.json(response.payload);
});

export { orderRoutes };
