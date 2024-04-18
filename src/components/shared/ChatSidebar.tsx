import Conversations from "./Conversations";

const ChatSidebar = () => {
  return (
    <div className="border border-[#474748] p-4 flex flex-col h-full bg-moment rounded-xl  w-[273px]">
      <div className="text-2xl font-medium py-2">Messages</div>
      <Conversations />
    </div>
  );
};

export default ChatSidebar;
