import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PendingRequest from "./PendingRequest";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import FriendRequest from "./FriendRequest";
import { FaRegBell } from "react-icons/fa";
import useListenReactions from "@/hooks/useListenReactions";
import { useSocketContext } from "@/context/SocketContext";
import ReactionNotify from "./ReactionNotify";
import { api } from "@/apis/apiGclient";
import { addFriend, addFriendRequest, changeUserDetails } from "@/state";

const Notification = () => {
  useListenReactions();
  const dispatch = useDispatch();
  const { _id } = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);

  const [friendRequests, setFriendRequests] = useState([]);
  const [pendingRequest, setPendingRequest] = useState([]);
  const { socket } = useSocketContext();
  const [reactions, setreactions] = useState([]);
  const [count, setCount] = useState(
    reactions.length + friendRequests.length + pendingRequest.length
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/users/${_id}/notification`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.friendRequests) {
          setFriendRequests(response.data.friendRequests);
        }
        if (response.data.pendingFriends) {
          setPendingRequest(response.data.pendingFriends);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isOpen]);

  const handleDropDown = () => {
    setIsOpen(!isOpen);
    if (isOpen === true) {
      setreactions([]);
      setCount(0);
    }
  };

  // Sockets
  // reaction
  useEffect(() => {
    socket?.on("newReaction", (newReaction: any) => {
      setreactions([...reactions, newReaction]);
      setCount(count + 1);
    });

    return () => socket?.off("newReaction");
  }, [socket, setreactions, reactions]);

  // new friend request
  useEffect(() => {
    socket?.on("newFriendRequest", (friendid: string) => {
      dispatch(addFriendRequest({ friendrequest: friendid }));
      setCount(count + 1);
    });
    return () => socket?.off("newFriendRequest");
  }, [socket]);

  // acceptFriendRequest
  useEffect(() => {
    socket?.on("acceptFriendRequest", (friendid: string) => {
      dispatch(addFriend({ friend: friendid }));
    });
    return () => socket?.off("acceptFriendRequest");
  }, [socket]);

  // remove friend request
  useEffect(() => {
    socket?.on("removeFriendRequest", (friendid) => {
      const updatedUser = { ...user };
      updatedUser.friendRequests = updatedUser.friendRequests.filter(
        (friendId: any) => friendId !== friendid
      );
      dispatch(changeUserDetails({ user: updatedUser }));
      setFriendRequests(friendRequests.filter((id: any) => id !== friendid));
      setCount(count - 1); // console.log(friendid);
    });
    return () => socket?.off("removeFriendRequest");
  }, [socket]);

  useEffect(() => {
    socket?.on("removeFriend", (friendid) => {
      const updatedUser = { ...user };
      updatedUser.friends = updatedUser.friends.filter(
        (friendId: any) => friendId !== friendid
      );
      dispatch(changeUserDetails({ user: updatedUser }));
    });
    return () => socket?.off("removeFriend");
  }, [socket]);

  // declineFriendRequest
  useEffect(() => {
    socket?.on("declineFriendRequest", (friendid) => {
      const updatedUser = { ...user };
      updatedUser.pendingFriends = updatedUser.pendingFriends.filter(
        (friendId: any) => friendId !== friendid
      );
      dispatch(changeUserDetails({ user: updatedUser }));
    });
    return () => socket?.off("declineFriendRequest");
  }, [socket]);

  return (
    <DropdownMenu onOpenChange={handleDropDown}>
      <DropdownMenuTrigger className="relative flex justify-center items-center">
        <FaRegBell className="h-6 w-6" />
        {count > 0 && (
          <div className="absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2">
            <div className="rounded-full border-8 border-primary opacity-75 h-2 w-2">
              {/* {count} */}
            </div>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-74 bg-secondary text-white">
        {reactions.length > 0 && (
          <>
            <DropdownMenuLabel>Reactions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem key={1} className="flex flex-col">
              {reactions.map((reaction: any) => (
                <>
                  <ReactionNotify
                    key={reaction.userId}
                    username={reaction.username}
                    avatarpath={reaction.avatarPath}
                    emoji={reaction.emojiReacted}
                    userId={reaction.userId}
                    momentPath={reaction.momentPath}
                    momentId={reaction.momentId}
                  />
                  <DropdownMenuSeparator />
                </>
              ))}
            </DropdownMenuItem>
          </>
        )}
        {pendingRequest.length > 0 && (
          <>
            <DropdownMenuLabel>Pending Requests</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {pendingRequest.map((pend) => (
                <PendingRequest friendId={pend} key={pend} />
              ))}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {friendRequests.length > 0 && (
          <>
            <DropdownMenuLabel>Friend Requests</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              {friendRequests.map((pend) => (
                <FriendRequest key={pend} friendId={pend} />
              ))}
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuLabel>
          {friendRequests.length <= 0 &&
            pendingRequest.length <= 0 &&
            reactions.length <= 0 && (
              <DropdownMenuItem>No Notifications</DropdownMenuItem>
            )}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
