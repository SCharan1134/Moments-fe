import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { setMemories } from "@/state";
import MemoryCard from "./MemoryCard";

interface MemoryWidgetProps {
  userId: string;
  isprofile?: boolean;
  refreshKey?: any;
}

const MemoryWidget: React.FC<MemoryWidgetProps> = ({
  userId,
  //   isProfile = false,
  refreshKey,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const memories = useSelector((state: any) => state.memories);
  const [key, setKey] = useState(0);

  const getMoments = async () => {
    const response = await axios.get(`http://localhost:3001/memories/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);

    dispatch(setMemories({ memories: response.data }));
  };
  const getUserMemories = async () => {
    const response = await axios.get(
      `http://localhost:3001/memories/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);

    dispatch(setMemories({ memories: response.data }));
  };
  return (
    <div>
      <div>Memories</div>
      <div className="flex w-96 overflow-x-scroll gap-4 scrollbar-hide">
        <MemoryCard MemoryUserId={user._id} />
      </div>
    </div>
  );
};

export default MemoryWidget;
