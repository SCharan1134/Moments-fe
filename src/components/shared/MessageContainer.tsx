import { useSelector } from "react-redux";
import MessageInput from "./MessageInput";
import MessageProfileBar from "./MessageProfileBar";
import Messages from "./Messages";

const MessageContainer = () => {
  const conversation = useSelector((state: any) => state.conversation);

  return (
    <div className="h-full w-full ">
      {conversation !== null ? (
        <div className="lg:w-[910px] w-screen rounded-xl pt-1 border lg:h-full xs:h-[750px] h-[840px] flex flex-col justify-between border-[#474748] bg-moment">
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
