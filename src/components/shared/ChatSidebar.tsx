import Conversations from "./Conversations";
import MessageContainer from "./MessageContainer";

const ChatSidebar = () => {
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <div className="text-2xl font-medium py-2">Messages</div>
      <Conversations />
    </div>
  );
};

export default ChatSidebar;
