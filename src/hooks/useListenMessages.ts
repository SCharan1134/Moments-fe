import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { setLastSeen, setMessages } from "@/state";
import Conversations from "@/components/shared/Conversations";

const useListenMessages = () => {
  const dispatch = useDispatch();

  const { socket } = useSocketContext();
  const messages = useSelector((state: any) => state.messages);
  const conversation = useSelector((state: any) => state.conversation);

  useEffect(() => {
    socket?.on("newMessage", (message: any) => {
      // newMessage.shouldShake = true;
      // setMessages([...messages, newMessage]);
      if (
        conversation !== null &&
        conversation._id !== message.conversationId
      ) {
        console.log({
          conversationId: message.conversationId,
          lastMessage: {
            text: message.text,
            sender: message.sender,
            seen: false,
          },
        });
        dispatch(
          setLastSeen({
            conversationId: message.conversationId,
            lastMessage: {
              text: message.text,
              sender: message.sender,
              seen: true,
            },
          })
        );
      } else {
        dispatch(setMessages({ messages: [...messages, message] }));
        dispatch(
          setLastSeen({
            conversationId: message.conversationId,
            lastMessage: {
              text: message.text,
              sender: message.sender,
              seen: false,
            },
          })
        );
      }

      // console.log("message", message);
      // console.log(conversation == null);
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, setMessages, messages, conversation]);
};
export default useListenMessages;
1;
