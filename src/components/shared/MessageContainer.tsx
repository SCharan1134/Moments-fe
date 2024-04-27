import { useDispatch, useSelector } from "react-redux";
import MessageInput from "./MessageInput";
import MessageProfileBar from "./MessageProfileBar";
import Messages from "./Messages";
import { useEffect } from "react";
import { api } from "@/apis/apiGclient";
import { setMessages } from "@/state";
import axios from "axios";

const MessageContainer = () => {
  const dispatch = useDispatch();

  const token = useSelector((state: any) => state.token);

  const user = useSelector((state: any) => state.user);

  const conversation = useSelector((state: any) => state.conversation);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.post(
          `${api}/messages/${conversation.participants[0]._id}`,
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
    if (conversation != null) {
      getMessages();
    }
  }, [conversation]);

  return (
    <div className="h-full w-full ">
      {conversation !== null ? (
        <div className="lg:w-[910px] w-screen rounded-xl pt-1 border lg:h-full xs:h-[750px] h-[840px] flex flex-col justify-between border-[#474748] bg-moment">
          <div>
            <MessageProfileBar />
          </div>
          <Messages />
          <div>
            <MessageInput />
          </div>
        </div>
      ) : (
        <div className="w-[1100px] flex items-center justify-center h-screen font-semibold text-xl">
          Select a conversation
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
