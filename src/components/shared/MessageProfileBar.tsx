import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { setConversation } from "@/state";

const MessageProfileBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const conversation = useSelector((state: any) => state.conversation);

  return (
    <div className="flex px-5 py-2 border-b border-[#474748] gap-5 bg-moment items-center">
      <div
        className="hover:bg-moment bg-secondary"
        onClick={() => {
          dispatch(setConversation({ conversation: null }));
        }}
      >
        <ChevronLeft />
      </div>
      <Avatar className="">
        <AvatarImage src={conversation.participants[0].avatarPath} />
        <AvatarFallback>
          <img src="https://github.com/shadcn.png" />
        </AvatarFallback>
      </Avatar>
      <div
        className="font-semibold text-lg cursor-pointer"
        onClick={() => {
          navigate(`/profile/${conversation.participants[0]._id}`);
          //   dispatch(setConversation({ conversation: null }));
        }}
      >
        {conversation.participants[0].userName}
      </div>
    </div>
  );
};

export default MessageProfileBar;
