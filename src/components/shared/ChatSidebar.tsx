import { ChevronLeft } from "lucide-react";
import Conversations from "./Conversations";
import { useNavigate } from "react-router-dom";

const ChatSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="border border-[#474748] p-4 flex flex-col h-full bg-moment rounded-xl lg:w-[273px] w-full">
      <div className="flex gap-5 items-center ">
        <div className="" onClick={() => navigate("/home")}>
          <ChevronLeft />
        </div>
        <div className="text-2xl font-medium py-2">Messages</div>
      </div>
      <Conversations />
    </div>
  );
};

export default ChatSidebar;
