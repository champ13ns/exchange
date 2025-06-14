import { createClient } from "redis";

async function connectRedis() {
  try {
    const clientInstance = await createClient().connect();
    return clientInstance;
  } catch (error: any) {
    throw new Error(error);
  }
}

export { connectRedis };
