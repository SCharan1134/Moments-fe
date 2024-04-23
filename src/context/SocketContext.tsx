import { api } from "@/apis/apiGclient";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";

// Define types for the context and socket
interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

// Create a context with the defined type
const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

// Custom hook to use the socket context
export const useSocketContext = () => {
  return useContext(SocketContext);
};

// Component to provide the socket context
export const SocketContextProvider: React.FC = ({ children }) => {
  // State for the socket and online users
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Get the authenticated user from Redux state
  const authUser = useSelector((state: any) => state.user);

  // Effect to handle socket connection/disconnection
  useEffect(() => {
    let socket: Socket | undefined;
    if (authUser) {
      // Connect to the socket server with the user ID as a query parameter
      const socket = io(`${api}`, {
        query: {
          userId: authUser._id,
        },
      });

      // Set the socket state
      setSocket(socket);

      // Listen for "getOnlineUsers" event to update online users
      socket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      // Cleanup function to close the socket connection when unmounting
      return () => socket.close();
    } else {
      // Close the socket connection if the user is not authenticated
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);
  // Dependency array to re-run effect when authUser changes

  // Provide the socket context value to children components
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
