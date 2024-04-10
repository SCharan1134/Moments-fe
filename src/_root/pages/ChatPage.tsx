import ChatSidebar from "@/components/shared/ChatSidebar";
import MessageContainer from "@/components/shared/MessageContainer";

const ChatPage = () => {
  return (
    <div className="flex max-w-[1290px]">
      <ChatSidebar />
      <MessageContainer />
    </div>
  );
};

export default ChatPage;
