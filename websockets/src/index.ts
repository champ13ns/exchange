import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const rooms: {
  [userId: string]: {
    socketDetails: WebSocket;
    joinedRooms: string[];
  };
} = {};

wss.on("connection", function connection(userSocket) {
  const id = randomId();
  rooms[id] = {
    socketDetails: userSocket,
    joinedRooms: [],
  };

  userSocket.on("message", (data) => {
    const parsedMessage = JSON.parse(data as unknown as string);

    if (parsedMessage.type === "SUBSCRIBE") {
      rooms[id].joinedRooms.push(parsedMessage.roomId);
    } else if (parsedMessage.type === "sendMessage") {
      const roomId = parsedMessage.roomId;
      const message = parsedMessage.message;
      Object.keys(rooms).forEach((userId) => {
        const { joinedRooms, socketDetails } = rooms[userId];
        if (joinedRooms.includes(roomId)) socketDetails.send(message);
      });
    }
  });
});

function randomId() {
  return Math.random();
}
