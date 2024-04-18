import { useSelector } from "react-redux";
import { extractTime } from "../../utils/extractTime";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import useConversation from "../../zustand/useConversation";

interface MessageProps {
  message: string;
  senderId: string;
  createdAt: any;
}

interface UserData {
  avatarPath: string;
}

const Message: React.FC<MessageProps> = ({ message, senderId, createdAt }) => {
  const authUser = useSelector((state: any) => state.user);
  //   const { selectedConversation } = useConversation();
  const fromMe = senderId === authUser._id;
  const formattedTime = extractTime(createdAt);
  const chatClassName = fromMe ? "justify-end" : "justify-start";
  const token = useSelector((state: any) => state.token);
  const [user, setUser] = useState<UserData | null>();
  const profilePic = fromMe ? authUser.avatarPath : user?.avatarPath;
  //   const profilePic = fromMe
  //     ? authUser.avatarPath
  //     : selectedConversation?.avatarPath;
  const bubbleBgColor = fromMe ? "bg-primary" : "bg-gray-500";

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/${senderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (senderId) getUser();
  }, [senderId]);

  return (
    <div className={`flex ${chatClassName} w-full items-center p-2 gap-2`}>
      <div>
        <Avatar className="size-7">
          <AvatarImage src={profilePic} />
          <AvatarFallback>
            <img src="https://github.com/shadcn.png" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col items-end">
        <div
          className={`chat-bubble text-white ${bubbleBgColor} p-2 rounded-lg max-w-[500px] min-w-14 h-auto break-words`}
        >
          {message}
        </div>
        <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};
export default Message;
