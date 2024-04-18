import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useGetUser = (id: any) => {
  const token = useSelector((state: any) => state.token);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3001/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) getUser();
  }, [id]);

  return { user, loading };
};
export default useGetUser;
