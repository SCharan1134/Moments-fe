import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

import { useState } from "react";

interface FriendProps {
  userid: string;
  avatarpath: string;
  friendId: string;
}

const Friend: React.FC<FriendProps> = ({ userid, avatarpath, friendId }) => {
  const { toast } = useToast();
  const { _id } = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const [isSent, setIsSent] = useState(false);

  const handleAddFriend = async () => {
    try {
      if (!isSent) {
        const response = await axios.patch(
          `http://localhost:3001/friends/${_id}/${friendId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsSent(true);
        toast({
          duration: 2000,
          description: response.data.message,
        });
        console.log("friend request sent", response);
      } else {
        const response = await axios.patch(
          `http://localhost:3001/friends/remove/request/${_id}/${friendId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsSent(false);
        toast({
          duration: 2000,
          description: response.data.message,
        });
        console.log("friend request removed", response);
      }
    } catch (error: any) {
      toast({
        duration: 2000,
        variant: "destructive",
        description: error?.response.data.message,
      });
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="flex w-full justify-between items-center px-2 py-1">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={`http://localhost:3001/avatar/${avatarpath}`} />
          <AvatarFallback>
            <img src="https://github.com/shadcn.png" />
          </AvatarFallback>
        </Avatar>
        <p>{userid}</p>
      </div>
      <Button onClick={handleAddFriend}>
        {isSent ? " sent" : "add Friend"}
      </Button>
    </div>
  );
};

export default Friend;
