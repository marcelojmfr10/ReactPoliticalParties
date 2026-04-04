import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface WebSocketContextState {
  status: ConnectionStatus;
}

export const WebSocketContext = createContext({} as WebSocketContextState);

interface Props {
  children: ReactNode;
  url: string;
}

export const WebSocketProvider = ({ children, url }: Props) => {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);

    ws.addEventListener("open", () => {
      setSocket(ws);
      setStatus("connected");
    });

    ws.addEventListener("close", () => {
      setSocket(null);
      setStatus("disconnected");
    });

    ws.addEventListener("error", (event) => {
      console.log({ customError: event });
    });

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      console.log({ message });
    });

    return ws;
  }, [url]);

  useEffect(() => {
    const ws = connect();
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [connect]);

  // función básica de reconexión
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === "disconnected") {
      interval = setInterval(() => {
        console.log("Reconnecting every 1 second...");
        connect();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, connect]);

  const send = (message: unknown) => {
    if (!socket) throw new Error("Socket not connected");
    if (status !== "connected")
      throw new Error("Socket not connected (status)");

    const jsonMessage = JSON.stringify(message);
    socket.send(jsonMessage);
  };

  return (
    <WebSocketContext value={{ status: status }}>{children}</WebSocketContext>
  );
};
