import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  avatarPath: string;
  friends: string[];
}

const MessageProfileBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);
  const conversations = useSelector((state: any) => state.conversation);
  const [ruser, setrUser] = useState<User>({
    _id: "",
    firstName: "string",
    lastName: "string",
    userName: "",
    email: "",
    avatarPath: "",
    friends: [],
  });
  const receiverid =
    conversations !== null
      ? conversations.participants[0] == user._id
        ? conversations.participants[1]
        : conversations.participants[0]
      : null;

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${receiverid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setrUser(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    fetchUser();

    return () => {
      // Reset conversation to null when the component unmounts
    };
  }, [conversations]);

  return (
    <div className="flex px-5 py-2 border-b border-[#474748] gap-5 bg-moment items-center">
      <Avatar className="">
        <AvatarImage src={ruser.avatarPath} />
        <AvatarFallback>
          <img src="https://github.com/shadcn.png" />
        </AvatarFallback>
      </Avatar>
      <div
        className="font-semibold text-lg cursor-pointer"
        onClick={() => {
          navigate(`/profile/${ruser._id}`);
          //   dispatch(setConversation({ conversation: null }));
        }}
      >
        {ruser.userName}
      </div>
    </div>
  );
};

export default MessageProfileBar;
