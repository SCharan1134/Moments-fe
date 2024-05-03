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
import { api } from "@/apis/apiGclient";
import {
  addFriend,
  addFriendRequest,
  changeUserDetails,
  setNewNotifications,
  setNotifications,
} from "@/state";
import {
  ReactMoment,
  CommentNotification,
  FriendsNotifications,
} from "./NotificationComponent";

const Notification = () => {
  useListenReactions();
  const dispatch = useDispatch();
  const { _id } = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);
  const notifications = useSelector((state: any) => state.notifications);
  const newNotifications = useSelector((state: any) => state.newNotifications);

  const [friendRequests, setFriendRequests] = useState([]);
  const [pendingRequest, setPendingRequest] = useState([]);
  const { socket } = useSocketContext();
  const [reactions, setreactions] = useState([]);
  const [count, setCount] = useState(
    reactions.length + friendRequests.length + pendingRequest.length
  );

  const [isOpen, setIsOpen] = useState(false);

  const fetchNewNotifications = async () => {
    try {
      const response = await axios.get(`${api}/notifications/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.length > 0) {
        dispatch(setNewNotifications({ notifications: response.data }));
        console.log(response.data);
      } else {
        dispatch(setNewNotifications({ notifications: [] }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchReadNotifications = async () => {
    try {
      const response = await axios.get(`${api}/notifications/read/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setNotifications({ notifications: response.data }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchReadNotifications();
    fetchNewNotifications();
    if (user.friendRequests) {
      setFriendRequests(user.friendRequests);
    }
    if (user.pendingFriends) {
      setPendingRequest(user.pendingFriends);
    }
    if (isOpen == true) {
      socket?.emit("markNotificationsAsSeen", {
        userId: _id,
      });
    }
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
  // useEffect(() => {
  //   socket?.on("newReaction", (newReaction: any, updatedmoment: any) => {
  //     setreactions([...reactions, newReaction]);
  //     setCount(count + 1);
  //   });

  //   return () => socket?.off("newReaction");
  // }, [socket, setreactions, reactions, setMomentEmoji, moment]);

  // new friend request
  useEffect(() => {
    socket?.on("newNotification", (notification: any) => {
      fetchNewNotifications();
    });
    return () => {
      socket?.off("newNotification");
    };
  }, [socket]);
  useEffect(() => {
    socket?.on("newFriendRequest", (friendid: string) => {
      dispatch(addFriendRequest({ friendrequest: friendid }));
      setCount(count + 1);
    });
    return () => {
      socket?.off("newFriendRequest");
    };
  }, [socket]);

  // acceptFriendRequest
  useEffect(() => {
    socket?.on("acceptFriendRequest", (friendid: string) => {
      dispatch(addFriend({ friend: friendid }));
    });
    return () => {
      socket?.off("acceptFriendRequest");
    };
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
    return () => {
      socket?.off("removeFriendRequest");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("removeFriend", (friendid) => {
      const updatedUser = { ...user };
      updatedUser.friends = updatedUser.friends.filter(
        (friendId: any) => friendId !== friendid
      );
      dispatch(changeUserDetails({ user: updatedUser }));
    });
    return () => {
      socket?.off("removeFriend");
    };
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
    return () => {
      socket?.off("declineFriendRequest");
    };
  }, [socket]);

  return (
    <DropdownMenu onOpenChange={handleDropDown}>
      <DropdownMenuTrigger className="relative flex justify-center items-center">
        <FaRegBell className="h-6 w-6" />
        {newNotifications.length > 0 && (
          <div className="absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2">
            <div className="rounded-full border-8 border-primary opacity-75 h-2 w-2">
              {/* {count} */}
            </div>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-96 h-[70vh]  bg-moment text-white  border-[#474748] rounded-xl mr-5 mt-5 overflow-y-scroll scrollbar-hide">
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
        {newNotifications != undefined && newNotifications.length > 0 && (
          <>
            {/* <DropdownMenuSeparator className="bg-[#474748]" /> */}
            <DropdownMenuItem
              key={1}
              className="flex flex-col items-start gap-1"
            >
              <DropdownMenuLabel className="text-lg p-1">
                New Notifications
              </DropdownMenuLabel>
              {newNotifications.map((notification: any) => (
                <>
                  {notification.type == "react" && (
                    <ReactMoment
                      avatarpath={notification.from.avatarPath}
                      username={notification.from.userName}
                      emoji={notification.emoji}
                      momentId={notification.moment._id}
                      momentPath={notification.moment.momentPath}
                      userId={notification.from._id}
                    />
                  )}
                  {notification.type == "comment" && (
                    <CommentNotification
                      avatarpath={notification.from.avatarPath}
                      username={notification.from.userName}
                      comment={notification.comment}
                      momentId={notification.moment._id}
                      momentPath={notification.moment.momentPath}
                      userId={notification.from._id}
                    />
                  )}
                  {notification.type == "friends" && (
                    <FriendsNotifications
                      avatarpath={notification.from.avatarPath}
                      username={notification.from.userName}
                      userId={notification.from._id}
                    />
                  )}
                </>
              ))}
            </DropdownMenuItem>
          </>
        )}
        {notifications.length > 0 && (
          <>
            {/* <DropdownMenuSeparator className="bg-[#474748]" /> */}
            <DropdownMenuItem
              key={1}
              className="flex flex-col items-start gap-1"
            >
              <DropdownMenuLabel className="text-lg p-1">
                Old Notifications
              </DropdownMenuLabel>
              {notifications.map((notification: any) => (
                <>
                  {notification.type == "react" && (
                    <ReactMoment
                      avatarpath={notification.from.avatarPath}
                      username={notification.from.userName}
                      emoji={notification.emoji}
                      momentId={notification.moment._id}
                      momentPath={notification.moment.momentPath}
                      userId={notification.from._id}
                    />
                  )}
                  {notification.type == "comment" && (
                    <CommentNotification
                      avatarpath={notification.from.avatarPath}
                      username={notification.from.userName}
                      comment={notification.comment}
                      momentId={notification.moment._id}
                      momentPath={notification.moment.momentPath}
                      userId={notification.from._id}
                    />
                  )}
                  {notification.type == "friends" && (
                    <FriendsNotifications
                      avatarpath={notification.from.avatarPath}
                      username={notification.from.userName}
                      userId={notification.from._id}
                    />
                  )}
                </>
              ))}
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuLabel className="flex w-full h-full justify-center items-center">
          {friendRequests.length <= 0 &&
            pendingRequest.length <= 0 &&
            notifications.length <= 0 && (
              <DropdownMenuItem>No Notifications</DropdownMenuItem>
            )}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
