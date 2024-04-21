import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { api } from "@/apis/apiGclient";

interface MemoryCardProps {
  MemoryId?: string;
  MemoryUserId: string;
  MemoryPath?: string;
  Likes?: Map<string, boolean>;
}

interface FriendData {
  _id: string;
  userName: string;
  avatarPath: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ MemoryUserId }) => {
  const [friendData, setFriendData] = useState<FriendData>();
  const token = useSelector((state: any) => state.token);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${api}/users/${MemoryUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriendData(response.data);
      console.log(friendData);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  };
  useEffect(() => {
    if (MemoryUserId) {
      fetchData();
    }
  }, []);
  return (
    <div>
      <div className="bg-gray-400 w-32 h-56 rounded-xl">
        <div
          className="flex flex-col h-full w-full items-center gap-3 cursor-pointer justify-center"
          // onClick={() => navigate(`/profile/${friendData?._id}`)}
        >
          <Avatar>
            <AvatarImage src={friendData?.avatarPath} />
            <AvatarFallback>
              <img src="https://github.com/shadcn.png" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p>{friendData?.userName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
