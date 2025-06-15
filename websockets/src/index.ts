import { WebSocketServer, WebSocket } from "ws";
import { RedisManager } from "./types/RediManager";
import { RedisClientType } from "@redis/client";

const wss = new WebSocketServer({ port: 8080 });

const rooms: {
  [userId: string]: {
    socketDetails: WebSocket;
    joinedRooms: string[];
  };
} = {};



let publisher: RedisClientType;
let subscriber: RedisClientType;

(async () => {
  let redisManagerInstance = await RedisManager.getInstace();
  publisher = redisManagerInstance.getPublisher();
  subscriber = redisManagerInstance.getSubscriber();
})();

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
      let roomId = parsedMessage.roomId;
      // check if atleast one person with this roomId is already subscribed to pub-sub, then don't resubscribe again.
      if (OnePersonSubscribedTo(roomId) == false) {
        subscriber.subscribe(roomId, (message) => {
          const parsedMessage = JSON.parse(message); 
          Object.keys(parsedMessage.).forEach((userId) => {
            console.log("userID ",userId)
            console.log("room details are ",rooms[userId])

            const { socketDetails, joinedRooms } = rooms[userId];
            if (joinedRooms.includes(parsedMessage.roomId))
              socketDetails.send(parsedMessage.message);
          });
        });
      }
    } else if (parsedMessage.type === "sendMessage") {
      const roomId = parsedMessage.roomId;
      const message = parsedMessage.message;

      publisher.publish(
        roomId,
        JSON.stringify({
          type: "sendMessage",
          message,
          roomId,
        })
      );
    }
  });
});

function randomId() : string {
   return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
}

function OnePersonSubscribedTo(roomId: string): boolean {
  let totalInterestedPerson = 0;
    // console.log("all rooms details are ",rooms)

  Object.keys(rooms).map((userId) => {
    if (rooms[userId].joinedRooms.includes(roomId)) {
      totalInterestedPerson++;
      console.log("total Interseted person in room",roomId,totalInterestedPerson)
      return true;
    }
  });
  return false;
}
