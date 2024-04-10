import { useSocketContext } from "@/context/SocketContext";
import { setConversation, setMessages } from "@/state";
import axios from "axios";
import React, { useEffect } from "react";
// import { ConversationType } from "../../types";
import { useDispatch, useSelector } from "react-redux";

interface ConversationProps {
  id: string;
  avatarpath: string;
  username: string;
  lastIdx?: boolean;
}

const Conversation: React.FC<ConversationProps> = ({
  id,
  username,
  avatarpath,
  lastIdx,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);
  const selectedConversation = useSelector((state: any) => state.conversation);
  const isSelected = selectedConversation?._id === id;
  // const isOnline = true; // Change this to your logic for online status
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(id);

  const getConversation = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/messages/${id}/conversation`,
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
      getMessages();
    } catch (error) {
      console.log(error);
    }
  };
  const getMessages = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/messages/${id}`,
        {
          senderId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setMessages({ messages: response.data }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    getConversation();
  };

  useEffect(() => {
    console.log(isOnline, "online");
  }, []);

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-moment rounded p-2 py-1 cursor-pointer
				${isSelected ? "bg-sky-500" : ""}
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
            <img
              src={`http://localhost:3001/avatar/${avatarpath}`}
              alt="user avatar"
              className="w-12 h-12 object-cover rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-primary">{username}</p>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
