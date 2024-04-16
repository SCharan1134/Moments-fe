import ChatSidebar from "@/components/shared/ChatSidebar";
import MessageContainer from "@/components/shared/MessageContainer";

const ChatPage = () => {
  return (
    <div className="flex  w-full bg-secondary text-white h-full overflow-clip">
      <div className="my-5 h-[635px]">
        <ChatSidebar />
      </div>
      <div className="my-5 h-[635px]">
        <MessageContainer />
      </div>
    </div>
  );
};

export default ChatPage;
