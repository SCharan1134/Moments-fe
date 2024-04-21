import { useEffect, useState } from "react";
import Friend from "./Friend";
import axios from "axios";
import { useSelector } from "react-redux";
import { api } from "@/apis/apiGclient";

interface FriendData {
  _id: string;
  userName: string;
  avatarPath: string;
}

const FriendSuggestionList = () => {
  const { _id } = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);

  const [friends, setFriends] = useState<FriendData[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get<FriendData[]>(
          `${api}/users/random/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, []);
  return (
    <div className="flex flex-col items-start w-full py-5">
      <div className="text-lg font-semibold pb-2 text-white">
        Suggested Friends
      </div>
      <div className="w-full">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            userid={friend.userName}
            avatarpath={friend.avatarPath}
            friendId={friend._id}
          />
        ))}
      </div>
      {/* <div className="text-md font-semibold pb-2 text-gray-400 ml-4">
        See all
      </div> */}
    </div>
  );
};

export default FriendSuggestionList;
