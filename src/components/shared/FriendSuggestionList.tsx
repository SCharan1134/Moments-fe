import { useEffect, useState } from "react";
import Friend from "./Friend";
import axios from "axios";
import { useSelector } from "react-redux";

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
          `http://localhost:3001/users/random/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, []);
  return (
    <div>
      {friends.map((friend) => (
        <Friend
          key={friend._id}
          userid={friend.userName}
          avatarpath={friend.avatarPath}
          friendId={friend._id}
        />
      ))}
    </div>
  );
};

export default FriendSuggestionList;
