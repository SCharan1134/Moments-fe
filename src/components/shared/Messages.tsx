import { useEffect, useRef } from "react";
import Message from "./Message";
import { useSelector } from "react-redux";
import useListenMessages from "@/hooks/useListenMessages";

const Messages = () => {
  const messages = useSelector((state: any) => state.messages);
  useListenMessages();
  // useListenMessages();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end", // Vertical alignment: start, center, end, nearest
        inline: "nearest",
      });
    }, 100);
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-x-auto w-full scrollbar-hide">
      {messages !== null &&
        messages.length > 0 &&
        messages.map((message: any) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message
              message={message.message}
              senderId={message.senderId}
              createdAt={message.createdAt}
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
