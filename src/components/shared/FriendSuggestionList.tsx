import { useEffect, useState } from "react";
import Friend from "./Friend";
import axios from "axios";
import { useSelector } from "react-redux";
import { api } from "@/apis/apiGclient";
import { Skeleton } from "../ui/skeleton";

interface FriendData {
  _id: string;
  userName: string;
  avatarPath: string;
}

const FriendSuggestionList = () => {
  const { _id } = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);

  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState<FriendData[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<FriendData[]>(
          `${api}/users/random/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFriends(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, []);
  return (
    <div className="flex flex-col items-start w-full py-5">
      <div className="text-lg font-semibold pb-2 text-white">
        Suggested Friends
      </div>
      <div className="w-full">
        {isLoading ? (
          <div>
            <div className="space-y-2 w-full flex gap-2 p-5">
              <Skeleton className="h-12 w-12 bg-secondary rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-2 w-[250px] bg-secondary" />
                <Skeleton className="h-1 w-[200px] bg-secondary" />
              </div>
            </div>
            <div className="space-y-2 w-full flex gap-2 p-5">
              <Skeleton className="h-12 w-12 bg-secondary rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-2 w-[250px] bg-secondary" />
                <Skeleton className="h-1 w-[200px] bg-secondary" />
              </div>
            </div>
            <div className="space-y-2 w-full flex gap-2 p-5">
              <Skeleton className="h-12 w-12 bg-secondary rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-2 w-[250px] bg-secondary" />
                <Skeleton className="h-1 w-[200px] bg-secondary" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {friends.map((friend) => (
              <Friend
                key={friend._id}
                userid={friend.userName}
                avatarpath={friend.avatarPath}
                friendId={friend._id}
              />
            ))}
          </>
        )}
      </div>
      {/* <div className="text-md font-semibold pb-2 text-gray-400 ml-4">
        See all
      </div> */}
    </div>
  );
};

export default FriendSuggestionList;
