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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  DotsVerticalIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import CustomComment from "@/components/shared/CustomComment";
import CreateComment from "@/components/shared/CreateComment";

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
  const isLiked =
    moment.likes instanceof Map // Check if likes is a Map
      ? moment.likes.has(loggedInUserId) // If so, use Map methods
      : typeof moment.likes === "object" && // Otherwise, if it's an object
        loggedInUserId in moment.likes && // Check if loggedInUserId exists in it
        Boolean(moment.likes[loggedInUserId]);

  const likeCount = Object.keys(moment.likes).length;
  const [loading, setLoading] = useState(false);
  const [replyUsername, setReplyUsername] = useState<string>("");
  const [isReply, setIsReply] = useState(false);
  const [commentid, setCommentid] = useState("");

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

  const patchLike = async () => {
    const response = await axios.patch(
      `http://localhost:3001/moments/${moment?._id}/like`,
      { userId: loggedInUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(setSingleMoment({ moment: response.data }));
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

  useEffect(() => {
    setLoading(true);
    fetchMoment();
    setLoading(false);

    // console.log(comments);
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
              <img
                src={`http://localhost:3001/moments/${moment?.momentPath}`}
                className="rouded-lg w-[630px] h-full object-cover"
              />
            </div>
            <div className="w-full h-full bg-secondary px-5 py-3">
              <div className="flex w-full justify-between items-center pb-3">
                <div
                  className=" flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/profile/${friendData?._id}`)}
                >
                  <Avatar>
                    <AvatarImage
                      src={`http://localhost:3001/avatar/${friendData?.avatarPath}`}
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
              <div className="w-full flex items-center justify-between mt-5">
                <div
                  className="flex items-center justify-center gap-2 cursor-pointer"
                  onClick={patchLike}
                >
                  {isLiked ? (
                    <HeartFilledIcon className="w-6 h-6 text-primary" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-primary" />
                  )}

                  <div>{likeCount}</div>
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
        </>
      )}
    </div>
  );
};

export default MomentPage;
