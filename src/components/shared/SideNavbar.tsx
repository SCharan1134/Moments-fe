import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiHome } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { TfiGallery } from "react-icons/tfi";
import { IoIosTimer } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { BiMessageSquareDetail } from "react-icons/bi";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

const SideNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const pageLoc = location.pathname.substring(1);
  console.log("Current location:", location.pathname.substring(1));

  return (
    <div className="p-5 w-full h-full pb-20">
      <div className="bg-moment w-full h-full pt-5 rounded-xl border-[#474748] border">
        <div
          className="relative flex flex-col w-full items-center gap-2 cursor-pointer"
          onClick={() => navigate(`/profile/${user._id}`)}
        >
          <Avatar className="z-10">
            <AvatarImage
              src={user.avatarPath}
              className="rounded-full h-20 w-20 "
            />
            <AvatarFallback className="rounded-full bg-slate-400  p-2">
              {user.userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute blur-md">
            <Avatar>
              <AvatarImage
                src={user.avatarPath}
                className="rounded-full h-20 w-20 "
              />
              <AvatarFallback className="rounded-full bg-slate-400  p-2">
                {user.userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="font-medium text-lg text-white">@{user.userName}</div>
        </div>
        <div className="text-white text-lg flex flex-col justify-center items-start gap-10 pl-10 py-5">
          <button
            className="flex gap-2 items-center font-semibold"
            onClick={() => navigate("/home")}
          >
            <FiHome />
            Home
          </button>
          <button
            className="flex gap-2 items-center"
            onClick={() => navigate("/search")}
          >
            <FaSearch />
            Search
          </button>
          {/* <button
            className="flex gap-2 items-center"
            onClick={() => navigate("/capsules")}
          >
            <IoIosTimer />
            Time Capsules
          </button> */}
          <button
            className="flex gap-2 items-center"
            onClick={() => navigate("/messages")}
          >
            <BiMessageSquareDetail />
            Messages
          </button>
          <button
            className="flex gap-2 items-center"
            onClick={() => navigate("/gallery")}
          >
            <TfiGallery />
            Gallery
          </button>
          <button
            className="flex gap-2 items-center mt-14"
            onClick={() => navigate("/settings")}
          >
            <IoMdSettings />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
