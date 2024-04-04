import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ChatBubbleIcon,
  DotsVerticalIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeUserDetails, setMoment } from "@/state";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { init } from "emoji-mart";
import { Button } from "../ui/button";

init({ data });

interface MomentProps {
  postId: string;
  postUserId: string;
  momentPath?: string;
  description?: string;
  visibility: "public" | "private" | "friends";
  emojis: { [userId: string]: string };
  comments: [];
  isArchive: Boolean;
  getArchive?: () => void;
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
  emojis,
  comments,
  isArchive,
  getArchive,
}) => {
  const dispatch = useDispatch();
  const [friendData, setFriendData] = useState<FriendData>();
  const token = useSelector((state: any) => state.token);
  const [isloading, setIsLoading] = useState(true);
  const loggedInUserId = useSelector((state: any) => state.user._id);
  const favorites = useSelector((state: any) => state.user.favoriteMoments);
  const isfavorite =
    favorites.find((favorite: any) => favorite === postId) !== undefined;
  const emojiReaction = emojis[loggedInUserId];
  const emojiCount = Object.keys(emojis).length;
  const commentCount = comments?.length ?? 0;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const patchEmoji = async (emoji: any) => {
    const response = await axios.patch(
      `http://localhost:3001/moments/${postId}/emoji`,
      {
        userId: loggedInUserId,
        emojis: emoji,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(setMoment({ moment: response.data }));
  };

  const deleteMoment = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/moments/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        duration: 2000,
        description: response.data.message,
      });
      console.log(response.data);
    } catch (err) {
      console.error("Error deleting moment", err);
    }
  };

  const addArchive = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", postUserId);
      formData.append("momentId", postId);
      const response = await axios.post(
        `http://localhost:3001/moments/archive/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        duration: 2000,
        description: response.data.message,
      });
    } catch (err) {
      console.error("Error archiving moment", err);
    }
  };

  const removeArchive = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", postUserId);
      formData.append("momentId", postId);
      const response = await axios.post(
        `http://localhost:3001/moments/archive/remove`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        duration: 2000,
        description: response.data.message,
      });
      if (getArchive) {
        getArchive();
      }
    } catch (err) {
      console.error("Error archiving moment", err);
    }
  };
  const addFavorite = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", postUserId);
      formData.append("momentId", postId);
      const response = await axios.post(
        `http://localhost:3001/moments/favorite/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        duration: 2000,
        description: response.data.message,
      });
      if (response.data.user) {
        dispatch(
          changeUserDetails({
            user: response.data.user,
          })
        );
      }
    } catch (err) {
      console.error("Error favorite moment", err);
    }
  };

  const removeFavorite = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", postUserId);
      formData.append("momentId", postId);
      const response = await axios.post(
        `http://localhost:3001/moments/favorite/remove`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        duration: 2000,
        description: response.data.message,
      });
      if (response.data.user) {
        dispatch(
          changeUserDetails({
            user: response.data.user,
          })
        );
      }
    } catch (err) {
      console.error("Error favorite moment", err);
    }
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <DotsVerticalIcon className="h-6 w-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-secondary py-5 px-3 flex flex-col gap-3 border border-black rounded-lg">
                {isfavorite ? (
                  <DropdownMenuItem
                    className="hover:text-primary"
                    onClick={removeFavorite}
                  >
                    remove favorites
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="hover:text-primary"
                    onClick={addFavorite}
                  >
                    add favorites
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="hover:text-primary"
                  onClick={() => navigate(`/moment/${postId}`)}
                >
                  got to moment
                </DropdownMenuItem>
                {loggedInUserId == postUserId && (
                  <>
                    {isArchive ? (
                      <DropdownMenuItem
                        className="hover:text-primary"
                        onClick={removeArchive}
                      >
                        remove archive
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="hover:text-primary"
                        onClick={addArchive}
                      >
                        archive
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="hover:text-black text-red-600"
                      onClick={deleteMoment}
                    >
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-2">
            <img
              src={`http://localhost:3001/moments/${momentPath}`}
              className="rounded-lg w-[450px] h-[450px]"
            />
          </div>
          <div className="w-full pl-5">{description}</div>

          <div className="flex justify-between w-full mx-10 my-5 pl-5">
            <div
              className="flex items-center justify-center gap-2 cursor-pointer rounded-full"
              // onClick={patchLike}
            >
              {/* {isLiked ? <HeartFilledIcon /> : <HeartIcon />} */}
              <div
                className={`text-xl hover:bg-primary transition-colors rounded-full h-8 w-8 ${
                  emojiReaction === "🔥" ? "bg-primary" : ""
                }`}
                onClick={() => patchEmoji("🔥")}
              >
                🔥
              </div>
              <div
                className={`text-xl hover:bg-primary transition-colors rounded-full h-8 w-8 ${
                  emojiReaction === "💖" ? "bg-primary" : ""
                }`}
                onClick={() => patchEmoji("💖")}
              >
                💖
              </div>
              <div
                className={`text-xl hover:bg-primary transition-colors rounded-full h-8 w-8 ${
                  emojiReaction === "😂" ? "bg-primary" : ""
                }`}
                onClick={() => patchEmoji("😂")}
              >
                😂
              </div>
              <div
                className={`text-xl hover:bg-primary transition-colors rounded-full h-8 w-8 ${
                  emojiReaction === "😍" ? "bg-primary" : ""
                }`}
                onClick={() => patchEmoji("😍")}
              >
                😍
              </div>
              <div
                className={`text-xl hover:bg-primary transition-colors rounded-full h-8 w-8 ${
                  emojiReaction === "🥲" ? "bg-primary" : ""
                }`}
                onClick={() => patchEmoji("🥲")}
              >
                🥲
              </div>
              <div
                className={`text-xl hover:bg-primary transition-colors rounded-full h-8 w-8 ${
                  emojiReaction === "😠" ? "bg-primary" : ""
                }`}
                onClick={() => patchEmoji("😠")}
              >
                😠
              </div>
              <Button
                className="rounded-full p-1 h-8 w-8"
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                +
              </Button>
              {showEmojiPicker && (
                <div className="absolute bottom-0 z-10 " ref={emojiPickerRef}>
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                      patchEmoji(emoji.native);
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}

              <div>{emojiCount}</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ChatBubbleIcon onClick={() => navigate(`/moment/${postId}`)} />
              {commentCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moment;
