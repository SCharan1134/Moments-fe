import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { api } from "@/apis/apiGclient";

interface FriendData {
  _id: string;
  userName: string;
  avatarPath: string;
}

const PendingRequest = ({ friendId }: any) => {
  const [friendData, setFriendData] = useState<FriendData>();
  const token = useSelector((state: any) => state.token);
  const [isremove, setIsRemove] = useState(false);
  const { _id } = useSelector((state: any) => state.user);

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        // console.log("hi");
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

  const removeRequest = async () => {
    try {
      if (!isremove) {
        const response = await axios.patch(
          `${api}/friends/remove/request/${_id}/${friendId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsRemove(true);
        console.log("friend request removed", response);
      } else {
        console.log("already removed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex w-full justify-between items-center px-2 py-1 gap-2">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={friendData?.avatarPath} />
          <AvatarFallback>
            <img src="https://github.com/shadcn.png" />
          </AvatarFallback>
        </Avatar>
        <p>{friendData?.userName}</p>
      </div>
      <Button onClick={removeRequest} className="px-2 py-5">
        {!isremove ? "Remove" : "removed"}
      </Button>
    </div>
  );
};

export default PendingRequest;
