import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { deleteCommentById } from "@/state";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomComment from "./CustomComment";
import { FiTrash2 } from "react-icons/fi";

interface CommentProps {
  commentId: string;
  avatarpath: string;
  description: string;
  userId: string;
  likes: Map<string, boolean>;
  replies: [];
  username: string;
  onReply: (username: string, commentid: string) => void;
}

interface CommentData {
  avatarPath: string;
  createdAt: string;
  description: string;
  likes: Map<string, boolean>;
  replies: []; // Assuming replies can be of any type
  updatedAt: string;
  userId: string;
  userName: string;
  __v: number;
  _id: string;
}

const ReplyComment: React.FC<CommentProps> = ({
  commentId,
  avatarpath,
  description,
  userId,
  likes,
  replies,
  username,
  onReply,
}) => {
  const dispatch = useDispatch();
  const [reply, setReply] = useState<CommentData[]>([]);
  const loggedInUserId = useSelector((state: any) => state.user._id);
  const token = useSelector((state: any) => state.token);
  const [like, setLike] = useState(likes);
  const isLiked =
    like instanceof Map // Check if likes is a Map
      ? like.has(loggedInUserId) // If so, use Map methods
      : typeof like === "object" && // Otherwise, if it's an object
        loggedInUserId in like && // Check if loggedInUserId exists in it
        Boolean(like[loggedInUserId]);
  const likeCount = Object.keys(like).length;
  const navigate = useNavigate();
  const [isViewReplies, setIsViewReplies] = useState(false);

  const patchLike = async () => {
    const response = await axios.post(
      `http://localhost:3001/comments/${commentId}/like`,
      { userId: loggedInUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // const updatedComment = {
    //   ...response.data,
    //   userName: username,
    //   avatarPath: avatarpath,
    // };
    setLike(response.data.likes);
    // dispatch(setComment({ comment: updatedComment }));
  };

  const fetchReplies = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/comments/replies/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      //   console.log(response.data);
      setReply(response.data);
      setIsViewReplies(true);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  const getlikes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/comments/${commentId}/cm`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data._id == commentId) {
        setLike(response.data.likes);
      }
    } catch (error) {
      console.error("Error fetching moment data:", error);
    }
  };

  useEffect(() => {
    getlikes();
  }, []);

  const deleteComment = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/comments/${userId}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      dispatch(deleteCommentById({ id: commentId }));
    } catch (error) {}
  };

  const handleReplyClick = () => {
    // Call the callback function and pass the username
    onReply(username, commentId);
  };

  return (
    <div className="  flex flex-col items-center justify-between py-2  m-1 px-3">
      <div className="group flex w-full gap-3 items-center">
        <Avatar className="w-8 h-8">
          <AvatarImage src={`http://localhost:3001/avatar/${avatarpath}`} />
          <AvatarFallback>
            <img src="https://github.com/shadcn.png" />
          </AvatarFallback>
        </Avatar>
        <div className="w-full flex flex-col">
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <p
                className="text-sm font-semibold cursor-pointer"
                onClick={() => navigate(`/profile/${userId}`)}
              >
                {username}
              </p>
              <p className="text-sm">{description}</p>
            </div>
            <div
              className="flex items-center justify-center gap-2 cursor-pointer"
              onClick={patchLike}
            >
              {isLiked ? (
                <HeartFilledIcon className="text-primary" />
              ) : (
                <HeartIcon className="text-primary" />
              )}
            </div>
          </div>
          <div className="text-xs flex gap-10 px-5 py-1">
            {likeCount > 0 ? <div>{likeCount} like</div> : <div>likes</div>}

            <div onClick={handleReplyClick}>reply</div>
            <div
              className="hidden group-hover:block text-primary "
              onClick={deleteComment}
            >
              <FiTrash2 className="h-4 w-4 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <div className=" flex items-start w-full px-10">
        {isViewReplies ? (
          <div className="flex flex-col w-full">
            {reply.map((replyData: CommentData) => (
              <CustomComment
                key={replyData._id}
                commentId={replyData._id}
                avatarpath={replyData.avatarPath}
                description={replyData.description}
                userId={replyData.userId}
                likes={replyData.likes}
                replies={replyData.replies}
                username={replyData.userName}
                onReply={(username: string, commentid: string) => {
                  onReply(username, commentid);
                }}
              />
            ))}
          </div>
        ) : (
          <>
            {replies.length > 0 && (
              <div
                className=" text-xs font-semibold"
                onClick={() => {
                  fetchReplies();
                  setIsViewReplies(true);
                }}
              >{`view replies (${replies.length})`}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReplyComment;
