import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/state";

const useListenReactions = () => {
  const dispatch = useDispatch();

  const { socket } = useSocketContext();
  const messages = useSelector((state: any) => state.messages);

  useEffect(() => {
    socket?.on("newReaction", (newReaction: any) => {
      // newMessage.shouldShake = true;
      // setMessages([...messages, newMessage]);
      //   dispatch(setMessages({ messages: [...messages, newMessage] }));
      console.log(newReaction);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);
};
export default useListenReactions;
1;
