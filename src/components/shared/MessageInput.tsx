import { useState } from "react";
import { BsSend } from "react-icons/bs";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/state";

const MessageInput = () => {
  const dispatch = useDispatch();

  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);
  const conversation = useSelector((state: any) => state.conversation);
  const messages = useSelector((state: any) => state.messages);
  const [message, setMessage] = useState("");
  const receiverid =
    conversation !== null
      ? conversation.participants[0] == user._id
        ? conversation.participants[1]
        : conversation.participants[0]
      : null;

  const sendMessage = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3001/messages/send/${receiverid}`,
        {
          message: message,
          senderId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(setMessages({ messages: [...messages, res.data] }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage();
    setMessage("");
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          <BsSend />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
