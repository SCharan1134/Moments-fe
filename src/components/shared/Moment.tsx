import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  BookmarkIcon,
  ChatBubbleIcon,
  DotsVerticalIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import axios from "axios";
import { useSelector } from "react-redux";

interface MomentProps {
  userId: string;
  momentPath?: string;
  description?: string;
  visibility: "public" | "private" | "friends";
}
interface FriendData {
  _id: string;
  userName: string;
  avatarPath: string;
}

const Moment: React.FC<MomentProps> = ({
  userId,
  momentPath,
  description,
  visibility,
}) => {
  const [friendData, setFriendData] = useState<FriendData>();
  const token = useSelector((state: any) => state.token);
  const [isloading, setIsLoading] = useState(true);

  const fetchData = async () => {
    console.log("loading");
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("response", response.data);
      setFriendData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, []);
  return (
    <div className="flex flex-col py-4 px-4 border m-2 rounded-lg">
      {isloading ? (
        <div>Loading</div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 ">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={`http://localhost:3001/avatar/${friendData?.avatarPath}`}
                />
                <AvatarFallback>
                  <img src="https://github.com/shadcn.png" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p>{friendData?.userName}</p>
                <p className="text-xs">{visibility}</p>
              </div>
            </div>
            <DotsVerticalIcon className="h-6 w-6" />
          </div>
          <div>{description}</div>
          <div className="mt-2 bg-red-300 ">
            <img src={`http://localhost:3001/moments/${momentPath}`} />
          </div>
          <div className="flex justify-between px-10 py-5">
            <div className="flex items-center justify-center gap-2">
              <HeartIcon />
              <div>Like</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ChatBubbleIcon />
              <div>Comment</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <BookmarkIcon />
              <div>Save</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Moment;
