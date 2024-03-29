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
// import io from "socket.io-client";

// const socket = io("http://localhost:3001");

const Notification = () => {
  const { _id } = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const [friendRequests, setFriendRequests] = useState([]);
  const [pendingRequest, setPendingRequest] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   socket.on("notification", (data) => {
  //     console.log("Received notification:", data.message);
  //     // Handle the notification
  //     // You might update the state or show a notification popup here
  //   });
  //   console.log(socket);
  //   // Clean up event listener when component unmounts
  //   return () => {
  //     socket.off("notification");
  //   };
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/${_id}/notification`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        if (response.data.friendRequests) {
          setFriendRequests(response.data.friendRequests);
          // console.log("friendRequests", friendRequests);
          // console.log("console", response.data.friendRequests);
        }
        if (response.data.pendingFriends) {
          setPendingRequest(response.data.pendingFriends);
          // console.log("pendingRequest", pendingRequest);
          // console.log("console", response.data.friendRequests);
        }
        // console.log(response.data.friendRequests);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isOpen]);

  return (
    <DropdownMenu onOpenChange={() => setIsOpen(!isOpen)}>
      <DropdownMenuTrigger className="flex justify-center items-center">
        <FaRegBell className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-74 bg-secondary">
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
          {friendRequests.length <= 0 && pendingRequest.length <= 0 && (
            <DropdownMenuItem>No Notifications</DropdownMenuItem>
          )}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
