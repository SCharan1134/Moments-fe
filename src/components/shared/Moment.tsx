import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChatBubbleIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeUserDetails, setMoment, setSingleMoment } from "@/state";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { api as apiG } from "@/apis/apiGclient";
import { useToast } from "../ui/use-toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { init } from "emoji-mart";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Skeleton } from "../ui/skeleton";
import { useSocketContext } from "@/context/SocketContext";
import { object } from "zod";

init({ data });

interface MomentProps {
  postId: string;
  postUserId: string;
  momentPath?: string[];
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
  // const emojiCount = Object.keys(emojis).length;
  const [emojiCount, setEmojiCount] = useState(Object.keys(emojis).length);
  const commentCount = comments?.length ?? 0;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const momentsLength = momentPath?.length;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

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
      setIsLoading(true);
      const response = await axios.get(`${apiG}/users/${postUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriendData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  };
  useEffect(() => {
    // console.log(momentPath?.[0]?.split(".").pop() === "mp4");
    if (postUserId) {
      fetchData();
    }
  }, []);

  const patchEmoji = async (emoji: any) => {
    const response = await axios.patch(
      `${apiG}/moments/${postId}/emoji`,
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
    setEmojiCount(Object.keys(response.data.emojis).length);
  };

  const deleteMoment = async () => {
    try {
      const response = await axios.delete(`${apiG}/moments/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
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
        `${apiG}/moments/archive/add`,
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
        `${apiG}/moments/archive/remove`,
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
        `${apiG}/moments/favorite/add`,
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
        `${apiG}/moments/favorite/remove`,
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

  const { socket } = useSocketContext();

  useEffect(() => {
    socket?.on("newemoji", (updatedmoment: any) => {
      if (postId == updatedmoment._id) {
        setEmojiCount(Object.keys(updatedmoment.emojis).length);
      }
    });

    return () => {
      socket?.off("newemoji");
    };
  }, [socket, setEmojiCount, emojiCount, postId, patchEmoji]);

  return (
    <div className="lg:p-4  rounded-2xl bg-secondary lg:w-[500px] w-full ">
      {isloading ? (
        <div className="flex flex-col space-y-3 w-full justify-center items-start">
          <div className="space-y-2 w-full flex gap-2 p-5">
            <Skeleton className="h-6 w-6 bg-moment" />
            <div className="space-y-2">
              <Skeleton className="h-2 w-[250px] bg-moment" />
              <Skeleton className="h-1 w-[200px] bg-moment" />
            </div>
          </div>
          <Skeleton className="h-[420px] w-full rounded-xl bg-moment" />
          <Skeleton className="h-4 w-[250px] bg-moment" />
          <Skeleton className="h-2 w-[200px] bg-moment" />
        </div>
      ) : (
        <div className="flex w-full flex-col items-center lg:px-1 px-2">
          <div className="flex w-full items-center justify-between lg:gap-3 gap-1">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/profile/${friendData?._id}`)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={friendData?.avatarPath} />
                <AvatarFallback>
                  <img src="https://github.com/shadcn.png" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-white lg:text-lg text-sm">
                  {friendData?.userName}
                </p>
                <p className="text-xs text-[#747271]">{visibility}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <DotsVerticalIcon className="h-6 w-6 text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-secondary text-white py-5 px-3 flex flex-col gap-3 border border-[#474748] rounded-lg">
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
          <div className="mt-3 w-full">
            {(momentsLength as number) > 1 ? (
              <div>
                <Carousel setApi={setApi}>
                  <CarouselContent>
                    {Array.from({ length: momentsLength as number }).map(
                      (_, index) => (
                        <CarouselItem key={index}>
                          <Card>
                            <CardContent className="p-0">
                              {momentPath?.[index]?.split(".").pop() ===
                              "mp4" ? (
                                // If it's a video, render a <video> tag
                                <div className="flex justify-center items-center">
                                  <video
                                    controls
                                    className="rounded-lg lg:w-[420px] lg:h-[420px] w-full h-[420px] bg-secondary object-contain "
                                  >
                                    <source
                                      src={momentPath?.[index]}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              ) : (
                                // If it's an image, render an <img> tag
                                <img
                                  src={momentPath?.[index]}
                                  className="rounded-lg lg:w-[420px] lg:h-[420px] w-full h-[400px] bg-secondary object-contain"
                                />
                              )}
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      )
                    )}
                  </CarouselContent>
                  <CarouselNext className="obsolute right-0 bg-primary opacity-50 scale-50 hover:opacity-100 hover:scale-75 transition-all" />
                  <CarouselPrevious className="obsolute left-0 bg-primary opacity-50 scale-50 hover:opacity-100 hover:scale-75 transition-all" />
                </Carousel>
                <div className="text-center text-sm text-muted-foreground text-white">
                  {current} of {count}
                </div>
              </div>
            ) : (
              <Card className="w-full">
                <CardContent className="p-0 border-none w-full ">
                  {momentPath?.[0]?.split(".").pop() === "mp4" ? (
                    // If it's a video, render a <video> tag
                    <div className="bg-secondary">
                      <video
                        controls
                        className="rounded-lg lg:w-[420px] lg:h-[420px] w-full h-[450px] bg-secondary object-contain"
                      >
                        <source
                          src={momentPath?.[0]}
                          type="video/mp4"
                          className=""
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    // If it's an image, render an <img> tag
                    <div className="relative w-full">
                      <img
                        src={momentPath?.[0]}
                        className="rounded-lg lg:w-[420px] lg:h-[420px] w-full h-[420px] bg-secondary object-contain bg-current"
                      />
                      {/* <img
                        src={`http://localhost:3001/moments/${momentPath?.[0]}`}
                        className="rounded-lg w-[420px] h-[420px] absolute top-0 blur-lg"
                      /> */}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          <div className="w-full lg:pl-5 pl-2 text-white mt-1">
            {description}
          </div>

          <div className="flex items-end justify-between w-full mx-10 lg:mt-5 mt-2">
            <div className="flex flex-col">
              <div className="flex items-start justify-center gap-2 cursor-pointer rounded-full">
                <div
                  className={`relative text-xl  transition-colors rounded-full h-8 w-8 `}
                  onClick={() => patchEmoji("🔥")}
                >
                  <div>🔥</div>
                  <div
                    className={`absolute  top-0 left-0 hover:blur-lg transition-all ${
                      emojiReaction === "🔥" ? "blur-lg" : ""
                    }`}
                  >
                    🔥
                  </div>
                </div>
                <div
                  className={`relative text-xl  rounded-full h-8 w-8`}
                  onClick={() => patchEmoji("💖")}
                >
                  <div>💖</div>
                  <div
                    className={`absolute  top-0 left-0 hover:blur-lg transition-all ${
                      emojiReaction === "💖" ? "blur-lg" : ""
                    }`}
                  >
                    💖
                  </div>
                </div>
                <div
                  className={`relative text-xl  rounded-full h-8 w-8 `}
                  onClick={() => patchEmoji("😂")}
                >
                  <div className="z-10">😂</div>
                  <div
                    className={`absolute top-0 left-0 hover:blur-lg transition-all ${
                      emojiReaction === "😂" ? "blur-lg" : ""
                    }`}
                  >
                    😂
                  </div>
                </div>
                <div
                  className={`text-xl relative rounded-full h-8 w-8 `}
                  onClick={() => patchEmoji("😍")}
                >
                  <div>😍</div>
                  <div
                    className={`absolute  top-0 left-0 hover:blur-lg transition-all ${
                      emojiReaction === "😍" ? "blur-lg" : ""
                    }`}
                  >
                    😍
                  </div>
                </div>
                <div
                  className={`text-xl relative rounded-full h-8 w-8 `}
                  onClick={() => patchEmoji("🥲")}
                >
                  <div>🥲</div>
                  <div
                    className={`absolute  top-0 left-0 hover:blur-lg transition-all ${
                      emojiReaction === "🥲" ? "blur-lg" : ""
                    }`}
                  >
                    🥲
                  </div>
                </div>
                <div
                  className={`text-xl relative rounded-full h-8 w-8 `}
                  onClick={() => patchEmoji("😠")}
                >
                  <div>😠</div>
                  <div
                    className={`absolute  top-0 left-0 hover:blur-lg transition-all ${
                      emojiReaction === "😠" ? "blur-lg" : ""
                    }`}
                  >
                    😠
                  </div>
                </div>
                <Button
                  className="rounded-full p-1 h-8 w-8"
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(true);
                  }}
                >
                  +
                </Button>
              </div>
              <div
                className="font-medium text-sm cursor-pointer text-white mt-1 ml-2"
                onClick={() => {
                  const fetchMoment = async () => {
                    try {
                      const response = await axios.get(
                        `${apiG}/moments/${postId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      dispatch(setSingleMoment({ moment: response.data }));
                      // setEmojiReaction(moment.emojis[loggedInUserId]);
                      // setEmojiCount(Object.keys(moment.emojis).length);
                      console.log("done");
                    } catch (error) {
                      console.error("Error fetching moment data:", error);
                    }
                  };
                  fetchMoment();
                  navigate(`/moment/${postId}`);
                }}
              >
                {emojiCount} Reacts
              </div>
            </div>
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
            <div
              className="flex flex-col items-center justify-center gap-2 pr-5 text-white"
              onClick={() => {
                // const fetchMoment = async () => {
                //   try {
                //     const response = await axios.get(
                //       `${apiG}/moments/${postId}`,
                //       {
                //         headers: {
                //           Authorization: `Bearer ${token}`,
                //         },
                //       }
                //     );
                //     dispatch(setSingleMoment({ moment: response.data }));
                //     // setEmojiReaction(moment.emojis[loggedInUserId]);
                //     // setEmojiCount(Object.keys(moment.emojis).length);
                //     console.log("done");
                //   } catch (error) {
                //     console.error("Error fetching moment data:", error);
                //   }
                // };
                // fetchMoment();
                navigate(`/moment/${postId}`);
              }}
            >
              <ChatBubbleIcon />
              <span className="font-medium">{commentCount} comments</span>
            </div>
          </div>

          <div className="border w-full border-[#474748] mt-10 lg:block hidden" />
        </div>
      )}
    </div>
  );
};

export default Moment;
