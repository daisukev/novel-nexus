import { useEffect, useReducer } from "react";
import { useMessageContext } from "../MessageContext";
import useToken from "../jwt.tsx";

const MESSAGE_TYPES = {
  CHAPTER: "CHAPTER",
  FOLLOW: "FOLLOW",
};

const WebSocketClient = () => {
  const { token } = useToken();
  const { createMessage, MESSAGE_TYPES } = useMessageContext();
  const httpUrl = process.env.REACT_APP_API_HOST;
  const wsUrl = httpUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
  useEffect(() => {
    if (token) {
      const socket = new WebSocket(`${wsUrl}/ws?token=${token}`);

      socket.onopen = () => {
        // console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        // console.log("Received:", message);
        switch (message.TYPE) {
          case MESSAGE_TYPES.CHAPTER:
            createMessage(
              message.message,
              MESSAGE_TYPES.INFO,
              10000,
              `/books/${message.book_id}/chapters/${message.chapter_id}`
            );
            break;
          case MESSAGE_TYPES.FOLLOW:
            createMessage(message.message, MESSAGE_TYPES.INFO);
            break;
          default:
            break;
        }
      };

      socket.onclose = () => {
        // console.log("WebSocket closed");
      };
      return () => {
        socket.close();
      };
    }
  }, [token]);

  return null;
};

export default WebSocketClient;
