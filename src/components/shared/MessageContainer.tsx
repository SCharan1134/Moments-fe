import { useSelector } from "react-redux";
import MessageInput from "./MessageInput";
import MessageProfileBar from "./MessageProfileBar";
import Messages from "./Messages";

const MessageContainer = () => {
  const conversation = useSelector((state: any) => state.conversation);

  return (
    <div className="h-full w-full px-5 ">
      {conversation !== null ? (
        <div className="w-[970px] rounded-xl pt-1 border h-full flex flex-col justify-between border-[#474748] bg-moment">
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
