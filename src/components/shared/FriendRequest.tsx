import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { api } from "@/apis/apiGclient";
import { addFriend, changeUserDetails } from "@/state";

interface FriendData {
  _id: string;
  userName: string;
  avatarPath: string;
}

const FriendRequest = ({ friendId }: any) => {
  const dispatch = useDispatch();
  const [friendData, setFriendData] = useState<FriendData>();
  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);
  const { _id } = useSelector((state: any) => state.user);

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const response = await axios.get(`${api}/users/${friendId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriendData(response.data);
      } catch (error) {
        console.error("Error fetching friend data:", error);
      }
    };
    if (friendId) {
      fetchFriendData();
    }
  }, [friendId]);

  const acceptRequest = async () => {
    try {
      const response = await axios.patch(
        `${api}/friends/request/${_id}/${friendId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("friend added", response.data);
      dispatch(changeUserDetails({ user: response.data }));
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const removeRequest = async () => {
    try {
      const response = await axios.patch(
        `${api}/friends/decline/request/${_id}/${friendId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("friend request removed", response);
      dispatch(changeUserDetails({ user: response.data }));
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="flex w-full justify-between items-center px-2 py-1 gap-1">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={friendData?.avatarPath} />
          <AvatarFallback>
            <img src="https://github.com/shadcn.png" />
          </AvatarFallback>
        </Avatar>
        <p>{friendData?.userName}</p>
      </div>
      <Button onClick={acceptRequest} className="px-2 py-5 mr-2">
        accept
      </Button>
      <Button onClick={removeRequest} className="px-2 py-5">
        decline
      </Button>
    </div>
  );
};

export default FriendRequest;
