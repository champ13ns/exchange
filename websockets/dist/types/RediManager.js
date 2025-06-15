"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisManager = void 0;
const redis_1 = require("redis");
class RedisManager {
    constructor() {
        this.publisherClient = (0, redis_1.createClient)();
        this.subscriberClient = (0, redis_1.createClient)();
    }
    connectClients() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.publisherClient.connect();
            yield this.subscriberClient.connect();
        });
    }
    static getInstace() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.instance) {
                this.instance = new RedisManager();
                yield this.instance.connectClients();
            }
            return this.instance;
        });
    }
    getPublisher() {
        return this.publisherClient;
    }
    getSubscriber() {
        return this.subscriberClient;
    }
}
exports.RedisManager = RedisManager;
