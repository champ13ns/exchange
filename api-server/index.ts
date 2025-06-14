import express from "express";
import cors from "cors";
import {
  depthRoutes,
  klineRoutes,
  orderRoutes,
  tickerRoutes,
  tradeRoutes,
} from "./src/routes";

import { connectRedis } from "./redisTest";
import { RedisManager } from "./src/types/RedisManager";

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/v1/order", orderRoutes);
  app.use("/api/v1/depth", depthRoutes);
  app.use("/api/v1/klines", klineRoutes);
  app.use("/api/v1/tickers", tickerRoutes);
  app.use("/api/v1/trades", tradeRoutes);

  const redisClient = await connectRedis();

  let redisMangerInstance: RedisManager = RedisManager.getInstance();

  let randomId = redisMangerInstance.getRandomClientId();
  console.log("random id is ", randomId);
  app.listen(3000, () => {
    console.log("Api server up and running in port 3000");
  });
}

startServer();
