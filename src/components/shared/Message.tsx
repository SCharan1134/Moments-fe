import { useSelector } from "react-redux";
import { extractTime } from "../../utils/extractTime";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckCircledIcon } from "@radix-ui/react-icons";

interface MessageProps {
  message: string;
  senderId: string;
  createdAt: any;
  seen: boolean;
  lastIdx: boolean;
}

const Message: React.FC<MessageProps> = ({
  message,
  senderId,
  createdAt,
  seen,
  lastIdx,
}) => {
  const authUser = useSelector((state: any) => state.user);
  const selectedConversation = useSelector((state: any) => state.conversation);
  const fromMe = senderId === authUser._id;
  const formattedTime = extractTime(createdAt);
  const chatClassName = fromMe ? "justify-end" : "justify-start";
  const bubbleBgColor = fromMe ? "bg-primary" : "bg-gray-500";
  const currentUser = senderId == authUser._id ? true : false;

  return (
    <div
      className={`flex 
       ${chatClassName} w-full  p-2 gap-2`}
    >
      <div className={`${currentUser && "hidden"}`}>
        <Avatar className="size-7">
          <AvatarImage
            src={
              currentUser
                ? selectedConversation.participants[0].avatarPath
                : authUser.avatarPath
            }
          />
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
        <div
          className={`opacity-50 text-xs flex gap-1 items-center ${
            currentUser ? "flex-row-reverse " : ""
          }`}
        >
          <p className="text-white">
            {currentUser && (
              <>
                {seen ? (
                  <CheckCircledIcon className="text-primary" />
                ) : (
                  <CheckCircledIcon className="text" />
                )}
              </>
            )}
          </p>
          <p> {formattedTime}</p>
        </div>
      </div>
      <div className={`${!currentUser && "hidden"}`}>
        <Avatar className="size-7">
          <AvatarImage
            src={
              currentUser
                ? selectedConversation.participants[0].avatarPath
                : authUser.avatarPath
            }
          />
          <AvatarFallback>
            <img src="https://github.com/shadcn.png" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
export default Message;
