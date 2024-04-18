import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import axios from "axios";
import { setComments, setSingleMoment } from "../../state/index";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import CustomComment from "@/components/shared/CustomComment";
import CreateComment from "@/components/shared/CreateComment";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { init } from "emoji-mart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import LikesModal from "@/components/shared/LikesModal";

init({ data });

interface FriendData {
  _id: string;
  userName: string;
  avatarPath: string;
}

const MomentPage = () => {
  const { momentId } = useParams();
  const [friendData, setFriendData] = useState<FriendData>();
  const navigate = useNavigate();
  const loggedInUserId = useSelector((state: any) => state.user._id);
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.token);
  const moment = useSelector((state: any) => state.moment);
  const comments = useSelector((state: any) => state.comments);
  const { toast } = useToast();
  const emojiReaction = moment.emojis[loggedInUserId];
  const emojiCount = Object.keys(moment.emojis).length;
  const [loading, setLoading] = useState(false);
  const [replyUsername, setReplyUsername] = useState<string>("");
  const [isReply, setIsReply] = useState(false);
  const [commentid, setCommentid] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [momentsLength, setMomentsLength] = useState(1);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

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

  const fetchMoment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/moments/${momentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setSingleMoment({ moment: response.data }));
      fetchFriend();
      getComments();
      setMomentsLength(response.data.momentPath.length);
    } catch (error) {
      console.error("Error fetching moment data:", error);
    }
  };

  const fetchFriend = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${moment.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFriendData(response.data);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  };

  const deleteMoment = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/moments/${moment?._id}`,
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
      navigate(`/home`);
      console.log(response.data);
    } catch (err) {
      console.error("Error deleting moment", err);
    }
  };

  const getComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/comments/${moment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response.data);
      dispatch(setComments({ comments: response.data }));
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  const patchEmoji = async (emoji: any) => {
    const response = await axios.patch(
      `http://localhost:3001/moments/${moment._id}/emoji`,
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

    dispatch(setSingleMoment({ moment: response.data }));
  };

  useEffect(() => {
    setLoading(true);
    fetchMoment();
    setLoading(false);
    return () => {
      dispatch(setComments({ comments: [] }));
    };
  }, [momentId]);

  const createCommentKey = replyUsername || "default";
  return (
    <div className="px-10 py-5   ">
      {loading ? (
        <>Loading</>
      ) : (
        <>
          <div className="border border-primary flex h-[600px] rounded-xl overflow-hidden">
            <div>
              {/* <img
                src={`http://localhost:3001/moments/${moment?.momentPath}`}
                className="rouded-lg w-[630px] h-full object-cover"
              /> */}
              {(momentsLength as number) > 1 ? (
                <div className="flex items-center">
                  <Carousel setApi={setApi} className="h-[600px] w-[480px]">
                    <CarouselContent>
                      {Array.from({ length: momentsLength as number }).map(
                        (_, index) => (
                          <CarouselItem key={index}>
                            <Card>
                              <CardContent className="p-0">
                                {moment.momentPath?.[index]
                                  ?.split(".")
                                  .pop() === "mp4" ? (
                                  // If it's a video, render a <video> tag
                                  <div className="flex justify-center items-center">
                                    <video
                                      controls
                                      className="rounded-lg h-[600px]"
                                    >
                                      <source
                                        src={moment.momentPath?.[index]}
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  </div>
                                ) : (
                                  // If it's an image, render an <img> tag
                                  <img
                                    src={moment.momentPath?.[index]}
                                    className="rounded-lg"
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
                  <div className="text-center text-sm text-muted-foreground">
                    {current}/{count}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0 h-[600px] w-[480px]">
                    {moment.momentPath?.[0]?.split(".").pop() === "mp4" ? (
                      // If it's a video, render a <video> tag
                      <div className="flex justify-center items-center">
                        <video controls className="rounded-lg h-[600px]">
                          <source
                            src={moment.momentPath?.[0]}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      // If it's an image, render an <img> tag
                      <img
                        src={moment.momentPath?.[0]}
                        className="rounded-lg "
                      />
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="w-full h-full bg-secondary px-5 py-3">
              <div className="flex w-full justify-between items-center pb-3">
                <div
                  className=" flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/profile/${friendData?._id}`)}
                >
                  <Avatar>
                    <AvatarImage
                      src={friendData?.avatarPath}
                      className="h-12 w-12"
                    />
                    <AvatarFallback>
                      <img src="https://github.com/shadcn.png" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p>{friendData?.userName}</p>
                    <p className="text-xs">{moment?.visibility}</p>
                  </div>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <DotsVerticalIcon className="h-6 w-6" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-secondary py-5 px-3 flex flex-col gap-3 border border-black rounded-lg">
                      <DropdownMenuItem
                        className=" hover:text-primary"
                        onClick={() => navigate(`/profile/${moment?.userId}`)}
                      >
                        go to profile
                      </DropdownMenuItem>
                      {loggedInUserId == moment?.userId && (
                        <>
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
              </div>
              <div className="h-[400px] overflow-y-scroll scrollbar-hide border-gray-200 border-t border-b">
                <div className="px-3 py-2">{moment?.description}</div>
                <div className="">
                  {comments.length > 0 ? (
                    comments.map((comment: any) => (
                      <CustomComment
                        key={comment._id}
                        commentId={comment._id}
                        avatarpath={comment.avatarPath}
                        description={comment.description}
                        userId={comment.userId}
                        likes={comment.likes}
                        replies={comment.replies}
                        username={comment.userName}
                        onReply={(username: string, commentid: string) => {
                          setReplyUsername(username);
                          setCommentid(commentid);
                          setIsReply(true);
                        }}
                      />
                    ))
                  ) : (
                    <p>No comments to display.</p>
                  )}
                </div>
              </div>
              <div className="w-full flex items-center justify-between gap-1">
                <div className="flex flex-col">
                  <div
                    className="font-semibold text-sm cursor-pointer pl-2 pt-2"
                    onClick={() => setShowModal(true)}
                  >
                    {emojiCount} Reacts
                  </div>
                  <div className="flex items-center justify-center gap-2 cursor-pointer rounded-full">
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
                      <div
                        className="absolute bottom-0 z-10 "
                        ref={emojiPickerRef}
                      >
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: any) => {
                            patchEmoji(emoji.native);
                            setShowEmojiPicker(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <CreateComment
                isReply={isReply}
                key={createCommentKey}
                userId={loggedInUserId}
                commentId={commentid}
                mommentId={moment._id}
                username={replyUsername}
                setIsReply={setIsReply}
              />
            </div>
          </div>
          {showModal && (
            <LikesModal momentId={moment._id} onClose={closeModal}>
              <Button onClick={closeModal}>close</Button>
            </LikesModal>
          )}
        </>
      )}
    </div>
  );
};

export default MomentPage;
