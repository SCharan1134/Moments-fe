import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
interface FriendProps {
  userId: string;
  avatarPath: string;
  userName: string;
  reacts?: boolean;
  emoji?: string;
}

const FriendTemplate: React.FC<FriendProps> = ({
  userId,
  avatarPath,
  userName,
  reacts,
  emoji,
}) => {
  const token = useSelector((state: any) => state.token);

  const [isRequest, setIsRequest] = useState(false);
  const [isfriends, setIsFriends] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user);

  const handleAddFriend = async () => {
    try {
      if (!isRequest) {
        const response = await axios.patch(
          `http://localhost:3001/friends/${currentUser._id}/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsRequest(true);
        toast({
          duration: 2000,
          description: response.data.message,
        });
        console.log("friend request sent", response);
      } else {
        const response = await axios.patch(
          `http://localhost:3001/friends/remove/request/${currentUser._id}/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsRequest(false);
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

  const handleFriendButton = async () => {
    if (!isfriends) {
      handleAddFriend();
    }
  };

  useEffect(() => {
    if (currentUser.friends.includes(userId)) {
      setIsFriends(true);
    }
    if (currentUser.pendingFriends.includes(userId)) {
      setIsRequest(true);
    }
  }, []);

  return (
    <div className="flex justify-between items-center p-1">
      <div
        className="flex gap-5 cursor-pointer"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <Avatar>
          <AvatarImage src={`http://localhost:3001/avatar/${avatarPath}`} />
          <AvatarFallback>
            <img src="https://github.com/shadcn.png" alt="avatar fallback" />
          </AvatarFallback>
        </Avatar>
        <div>{userName}</div>
      </div>
      {reacts ? (
        <div>{emoji}</div>
      ) : (
        currentUser._id !== userId && (
          <Button onClick={handleFriendButton}>
            {isfriends
              ? "friends"
              : isRequest
              ? "Remove Request"
              : "Add Friend"}
          </Button>
        )
      )}
    </div>
  );
};

export default FriendTemplate;
