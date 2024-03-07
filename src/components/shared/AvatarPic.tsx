import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";

const AvatarPic = () => {
  const { avatarPath, userName } = useSelector((state: any) => state.user);

  return (
    <div>
      <Avatar>
        <AvatarImage
          src={`http://localhost:3001/avatar/${avatarPath}`}
          className="rounded-full h-10 w-10"
        />
        <AvatarFallback className="rounded-full h-10 w-10 bg-slate-400  p-2">
          {userName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarPic;
