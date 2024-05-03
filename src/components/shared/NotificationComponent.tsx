import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";

interface NotificationComponentProps {
  _id: string;
  from: any;
  to: string;
  type: string;
  read: boolean;
  moment: any;
  emoji: string;
  comment: string;
}

interface ReactMomentProps {
  avatarpath: string;
  username: string;
  emoji: string;
  momentId: string;
  userId: string;
  momentPath: string;
}
interface FriendsNotificationsProps {
  avatarpath: string;
  username: string;
  userId: string;
}
interface CommentNotificationProps {
  avatarpath: string;
  username: string;
  userId: string;
  comment: string;
  momentId: string;
  momentPath: string;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  _id,
  from,
  to,
  type,
  read,
  moment,
  emoji,
  comment,
}) => {
  return (
    <div>
      {type == "react" && (
        <ReactMoment
          avatarpath={from.avatarPath}
          username={from.userName}
          emoji={emoji}
          momentId={moment._id}
          userId={from._id}
          momentPath={moment.momentPath}
        />
      )}
    </div>
  );
};

export const ReactMoment: React.FC<ReactMomentProps> = ({
  avatarpath,
  username,
  emoji,
  momentId,
  userId,
  momentPath,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center text-white">
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
          <img className="h-8 w-8" src={momentPath} />
        </span>
      </div>
    </div>
  );
};
export const CommentNotification: React.FC<CommentNotificationProps> = ({
  avatarpath,
  username,
  comment,
  momentId,
  userId,
  momentPath,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center text-white">
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
        had commented your moment{" "}
        <span onClick={() => navigate(`/moment/${momentId}`)}>
          <img className="h-8 w-8" src={momentPath} />
        </span>
      </div>
    </div>
  );
};

export const FriendsNotifications: React.FC<FriendsNotificationsProps> = ({
  avatarpath,
  username,
  userId,
}) => {
  const CurrentUser = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  return (
    <div className="flex items-center text-white w-full gap-1">
      <Avatar className="size-6 rounded-full">
        <AvatarImage src={CurrentUser.avatarPath} />
        <AvatarFallback>
          <img src="https://github.com/shadcn.png" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1">
        you and
        <span
          className="font-semibold flex items-center gap-1 cursor-pointer"
          onClick={() => {
            navigate(`/profile/${userId}`);
          }}
        >
          <Avatar className="size-6 rounded-full">
            <AvatarImage src={avatarpath} />
            <AvatarFallback>
              <img src="https://github.com/shadcn.png" />
            </AvatarFallback>
          </Avatar>
          {username}
        </span>
        are friends now
      </div>
    </div>
  );
};

export default NotificationComponent;
