import { api } from "@/apis/apiGclient";
import { setConversations } from "@/state";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetConversations = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.token);

  const [loading, setLoading] = useState(false);
  // const [conversations, setConversations] = useState([]);
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${api}/messages/${user._id}/conversations`,
          {
            // Data object
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(res.data);
        // setConversations(res.data);
        // console.log("hi");
        dispatch(setConversations({ conversations: res.data }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading };
};
export default useGetConversations;
