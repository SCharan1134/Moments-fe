import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/state";

const useListenMessages = () => {
  const dispatch = useDispatch();

  const { socket } = useSocketContext();
  const messages = useSelector((state: any) => state.messages);

  useEffect(() => {
    socket?.on("newMessage", (newMessage: any) => {
      // newMessage.shouldShake = true;
      // setMessages([...messages, newMessage]);
      dispatch(setMessages({ messages: [...messages, newMessage] }));
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);
};
export default useListenMessages;
1;
