import { api } from "@/apis/apiGclient";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import useConversation from "../zustand/useConversation";

interface ConversationState {
  selectedConversation: any; // Replace 'any' with the type of your conversation object
  messages: any; // Use the 'Message' interface here
}

const useGetMessages = (id: any) => {
  const token = useSelector((state: any) => state.token);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  //   const { messages, setMessages, selectedConversation } = useConversation<ConversationState>();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${api}/messages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) getMessages();
  }, [id]);

  return { messages, loading };
};
export default useGetMessages;
