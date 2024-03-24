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

const Notification = () => {
  const { _id } = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const [friendRequests, setFriendRequests] = useState([]);
  const [pendingRequest, setPendingRequest] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

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

    // Call the API initially when the component mounts
    fetchData();

    // Set up an interval to fetch data every 5 seconds (for example)
    // const intervalId = setInterval(fetchData, 5000);

    // // Clean up the interval on component unmount
    // return () => clearInterval(intervalId);
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
                <PendingRequest friendId={pend} />
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
