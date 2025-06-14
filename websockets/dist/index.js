"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const rooms = {};
// setInterval(() => {
// }, 3000);
wss.on("connection", function connection(userSocket) {
    const id = randomId();
    // @ts-ignore
    rooms[id] = {
        socketDetails: userSocket,
        joinedRooms: [],
    };
    userSocket.on("message", (data) => {
        const parsedMessage = JSON.parse(data);
        console.log("parsed Message is ", parsedMessage);
        if (parsedMessage.type === "SUBSCRIBE") {
            rooms[id].joinedRooms.push(parsedMessage.roomId);
        }
        else if (parsedMessage.type === "sendMessage") {
            const roomId = parsedMessage.roomId;
            const message = parsedMessage.message;
            Object.keys(rooms).forEach((userId) => {
                const { joinedRooms, socketDetails } = rooms[userId];
                if (joinedRooms.includes(roomId))
                    socketDetails.send(message);
            });
        }
    });
});
function randomId() {
    return Math.random();
}
