import { api } from "@/apis/apiGclient";
import { useSocketContext } from "@/context/SocketContext";
import { setConversation, setMessages } from "@/state";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import axios from "axios";
import React, { useEffect } from "react";
// import { ConversationType } from "../../types";
import { useDispatch, useSelector } from "react-redux";

interface ConversationProps {
  id: string;
  userid: string;
  avatarpath: string;
  username: string;
  lastIdx?: boolean;
  lastmessage?: string;
  lastsender?: string;
  lastseen?: boolean;
}

const Conversation: React.FC<ConversationProps> = ({
  id,
  userid,
  username,
  avatarpath,
  lastmessage,
  lastsender,
  lastseen,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);
  const selectedConversation = useSelector((state: any) => state.conversation);
  const isSelected = selectedConversation?._id === id;
  const isUser = lastsender !== null && lastsender == user._id ? true : false;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(userid);

  const getConversation = async () => {
    try {
      const response = await axios.post(
        `${api}/messages/${id}/conversation`,
        {
          senderId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setConversation({ conversation: response.data }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    getConversation();
  };

  // useEffect(() => {
  //   console.log(isOnline, "online");
  // }, []);

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-moment rounded p-2 py-1 cursor-pointer
				${isSelected ? "bg-secondary rounded-lg " : ""}
			`}
        onClick={handleClick}
      >
        <div className={`avatar relative ${isOnline ? "" : ""}`}>
          {isOnline && (
            <div className="absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2">
              <div className="rounded-full border-8 border-green-300"></div>
            </div>
          )}
          <div className="w-12 rounded-full">
            {/* <img
              src={avatarpath}
              alt="user avatar"
              className="w-12 h-12 object-cover rounded-full"
            /> */}
            <Avatar>
              <AvatarImage
                src={avatarpath}
                className="rounded-full h-10 w-10"
              />
              <AvatarFallback className="rounded-full h-10 w-10 bg-slate-400  p-2">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex flex-col justify-between">
            <p className="font-bold">{username}</p>
            <>
              {lastsender !== null && (
                <div>
                  {isUser ? (
                    <p>you: {lastmessage}</p>
                  ) : (
                    <div>
                      {lastseen ? (
                        <p className="">{lastmessage}</p>
                      ) : (
                        <p className="text-primary">new unread message</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Conversation;
