import { RedisClientType, createClient } from "redis";
export class RedisManager {
  private publisherClient: RedisClientType;
  private subscriberClient: RedisClientType;
  private static instance: RedisManager;

  private constructor() {
    this.publisherClient = createClient();
    this.subscriberClient = createClient();
  }

  private async connectClients() {
    await this.publisherClient.connect();
    await this.subscriberClient.connect();
  }

  public static async getInstace(): Promise<RedisManager> {
    if (!this.instance) {
      this.instance = new RedisManager();
      await this.instance.connectClients();
    }
    return this.instance;
  }

  public getPublisher(): RedisClientType {
    return this.publisherClient;
  }

  public getSubscriber(): RedisClientType {
    return this.subscriberClient;
  }
}
