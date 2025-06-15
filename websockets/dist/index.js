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
const ws_1 = require("ws");
const RediManager_1 = require("./types/RediManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const rooms = {};
let publisher;
let subscriber;
(() => __awaiter(void 0, void 0, void 0, function* () {
    let redisManagerInstance = yield RediManager_1.RedisManager.getInstace();
    publisher = redisManagerInstance.getPublisher();
    subscriber = redisManagerInstance.getSubscriber();
}))();
wss.on("connection", function connection(userSocket) {
    const id = randomId();
    rooms[id] = {
        socketDetails: userSocket,
        joinedRooms: [],
    };
    userSocket.on("message", (data) => {
        console.log("all rooms details are ", rooms);
        const parsedMessage = JSON.parse(data);
        if (parsedMessage.type === "SUBSCRIBE") {
            rooms[id].joinedRooms.push(parsedMessage.roomId);
            let roomId = parsedMessage.roomId;
            // check if atleast one person with this roomId is already subscribed to pub-sub, then don't resubscribe again.
            if (OnePersonSubscribedTo(roomId) == false) {
                subscriber.subscribe(roomId, (message) => {
                    const parsedMessage = JSON.parse(message);
                    Object.keys(parsedMessage).forEach((userId) => {
                        const { socketDetails, joinedRooms } = rooms[userId];
                        if (joinedRooms.includes(parsedMessage.roomId))
                            socketDetails.send(parsedMessage.message);
                    });
                });
            }
        }
        else if (parsedMessage.type === "sendMessage") {
            const roomId = parsedMessage.roomId;
            const message = parsedMessage.message;
            publisher.publish(roomId, JSON.stringify({
                type: "sendMessage",
                message,
                roomId,
            }));
        }
    });
});
function randomId() {
    return Math.random();
}
function OnePersonSubscribedTo(roomId) {
    let totalInterestedPerson = 0;
    Object.keys(rooms).map((userId) => {
        if (rooms[userId].joinedRooms.includes(roomId)) {
            totalInterestedPerson++;
            return true;
        }
    });
    return false;
}
