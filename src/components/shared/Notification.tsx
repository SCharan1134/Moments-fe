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
import { useSelector } from "react-redux";
import FriendRequest from "./FriendRequest";
import { FaRegBell } from "react-icons/fa";
import useListenReactions from "@/hooks/useListenReactions";
import { useSocketContext } from "@/context/SocketContext";
import ReactionNotify from "./ReactionNotify";
import { api } from "@/apis/apiGclient";

const Notification = () => {
  useListenReactions();
  const { _id } = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
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

  useEffect(() => {
    socket?.on("newReaction", (newReaction) => {
      // newMessage.shouldShake = true;
      // setMessages([...messages, newMessage]);
      //   dispatch(setMessages({ messages: [...messages, newMessage] }));
      setreactions([...reactions, newReaction]);
      setCount(count + 1);
    });

    return () => socket?.off("newMessage");
  }, [socket, setreactions, reactions]);

  useEffect(() => {
    socket?.on("newFriendRequest", (friendid) => {
      // newMessage.shouldShake = true;
      // setMessages([...messages, newMessage]);
      //   dispatch(setMessages({ messages: [...messages, newMessage] }));
      setFriendRequests([...friendRequests, friendid]);
      setCount(count + 1);
      // console.log(friendid);
    });
    console.log(friendRequests);
    return () => socket?.off("newMessage");
  }, [socket, setFriendRequests, friendRequests]);

  useEffect(() => {
    socket?.on("removeFriendRequest", (friendid) => {
      // newMessage.shouldShake = true;
      // setMessages([...messages, newMessage]);
      //   dispatch(setMessages({ messages: [...messages, newMessage] }));
      setFriendRequests(friendRequests.filter((id: any) => id !== friendid));
      setCount(count - 1); // console.log(friendid);
    });
    return () => socket?.off("newMessage");
  }, [socket, setFriendRequests, friendRequests]);

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
      <DropdownMenuContent className="w-74 bg-secondary">
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
