import { useSelector } from "react-redux";
import MessageInput from "./MessageInput";
import MessageProfileBar from "./MessageProfileBar";
import Messages from "./Messages";

const MessageContainer = () => {
  const conversation = useSelector((state: any) => state.conversation);

  return (
    <div>
      {conversation !== null ? (
        <div className="w-[1100px] h-screen flex flex-col justify-between pb-16">
          <div>
            <MessageProfileBar />
          </div>
          <Messages />
          <div>
            <MessageInput />
          </div>
        </div>
      ) : (
        <div className="w-[1100px] flex items-center justify-center h-screen font-semibold text-xl">
          Select a conversation
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
