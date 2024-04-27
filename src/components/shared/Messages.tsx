import { useEffect, useRef } from "react";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import useListenMessages from "@/hooks/useListenMessages";
import { useSocketContext } from "@/context/SocketContext";
import { setLastSeen, setMessages } from "@/state";

const Messages = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: any) => state.messages);
  const currentUser = useSelector((state: any) => state.user);
  const selectedConversation = useSelector((state: any) => state.conversation);
  useListenMessages();
  const { socket } = useSocketContext();

  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket?.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.participants[0]._id,
      });
    }

    socket?.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        const updatedMessages = messages.map((message: any) => {
          if (!message.seen) {
            return {
              ...message,
              seen: true,
            };
          }
          return message;
        });
        dispatch(setMessages({ messages: [...updatedMessages] }));
        dispatch(
          setLastSeen({
            conversationId: selectedConversation._id,
            lastMessage: {
              ...selectedConversation.lastMessage,
              seen: true,
            },
          })
        );
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);
  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      dispatch(
        setLastSeen({
          conversationId: selectedConversation._id,
          lastMessage: {
            ...selectedConversation.lastMessage,
            seen: true,
          },
        })
      );
    }
  }, [socket]);

  return (
    <div className="px-4 flex-1 overflow-x-auto w-full scrollbar-hide">
      {messages !== null &&
        messages.length > 0 &&
        messages.map((message: any, idx: any) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message
              seen={message.seen}
              message={message.text}
              senderId={message.sender}
              createdAt={message.createdAt}
              lastIdx={idx === messages.length - 1}
            />
          </div>
        ))}

      {messages !== null && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};
export default Messages;
