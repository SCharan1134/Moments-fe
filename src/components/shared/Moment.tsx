import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  BookmarkIcon,
  ChatBubbleIcon,
  DotsVerticalIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMoment } from "@/state";
import { useNavigate } from "react-router-dom";

interface MomentProps {
  postId: string;
  postUserId: string;
  momentPath?: string;
  description?: string;
  visibility: "public" | "private" | "friends";
  likes: Map<string, boolean>;
}
interface FriendData {
  _id: string;
  userName: string;
  avatarPath: string;
}

const Moment: React.FC<MomentProps> = ({
  postId,
  postUserId,
  momentPath,
  description,
  visibility,
  likes,
}) => {
  const dispatch = useDispatch();

  const [friendData, setFriendData] = useState<FriendData>();
  const token = useSelector((state: any) => state.token);
  const [isloading, setIsLoading] = useState(true);
  const loggedInUserId = useSelector((state: any) => state.user._id);
  const isLiked =
    likes instanceof Map // Check if likes is a Map
      ? likes.has(loggedInUserId) // If so, use Map methods
      : typeof likes === "object" && // Otherwise, if it's an object
        loggedInUserId in likes && // Check if loggedInUserId exists in it
        Boolean(likes[loggedInUserId]);

  const likeCount = Object.keys(likes).length;
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${postUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFriendData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  };
  useEffect(() => {
    if (postUserId) {
      fetchData();
    }
  }, []);

  const patchLike = async () => {
    const response = await axios.patch(
      `http://localhost:3001/moments/${postId}/like`,
      { userId: loggedInUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(setMoment({ moment: response.data }));
  };

  return (
    <div className="py-4 px-4 border border-black  rounded-2xl bg-moment w-[500px] h-[600px]">
      {isloading ? (
        <div>Loading</div>
      ) : (
        <div className="flex flex-col items-center   ">
          <div className="flex w-full pl-2 items-center justify-between gap-3 ">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/profile/${friendData?._id}`)}
            >
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
          <div className="mt-2">
            <img
              src={`http://localhost:3001/moments/${momentPath}`}
              className="rounded-lg w-[450px] h-[450px]"
            />
          </div>
          <div className="w-full pl-5">{description}</div>

          <div className="flex justify-between w-full px-10 py-5 pl-5">
            <div
              className="flex items-center justify-center gap-2 cursor-pointer"
              onClick={patchLike}
            >
              {isLiked ? <HeartFilledIcon /> : <HeartIcon />}

              <div>{likeCount}</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ChatBubbleIcon />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moment;
