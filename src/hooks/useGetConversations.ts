import { api } from "@/apis/apiGclient";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useGetConversations = () => {
  const token = useSelector((state: any) => state.token);

  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${api}/users/${user._id}/friends`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};
export default useGetConversations;
