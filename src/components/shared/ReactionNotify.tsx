import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect } from "react";

interface ReactionNotifyProps {
  avatarpath: string;
  username: string;
  emoji: string;
  userId: string;
  momentPath: string;
  momentId: string;
}

const ReactionNotify: React.FC<ReactionNotifyProps> = ({
  avatarpath,
  username,
  emoji,
  momentId,
  userId,
  momentPath,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center">
      <Avatar className="size-6 rounded-full">
        <AvatarImage src={avatarpath} />
        <AvatarFallback>
          <img src="https://github.com/shadcn.png" />
        </AvatarFallback>
      </Avatar>
      <div>
        <span
          className="font-semibold"
          onClick={() => {
            navigate(`/profile/${userId}`);
          }}
        >
          {username}
        </span>{" "}
        had {emoji} your moment{" "}
        <span onClick={() => navigate(`/moment/${momentId}`)}>
          <img
            className="h-8 w-8"
            src={`http://localhost:3001/moments/${momentPath}`}
          />
        </span>
      </div>
    </div>
  );
};

export default ReactionNotify;
