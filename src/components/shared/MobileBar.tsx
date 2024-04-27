import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiHome } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { TfiGallery } from "react-icons/tfi";
import { IoIosTimer } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { BiMessageSquareDetail } from "react-icons/bi";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useState, useEffect } from "react";

const MobileBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const conversation = useSelector((state: any) => state.conversation);
  const pageLoc = location.pathname.substring(1);
  const [isselected, setIsSelected] = useState(false);
  useEffect(() => {
    if (conversation != null) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [conversation]);
  // console.log("Current location:", location.pathname.substring(1));

  return (
    <div
      className={`lg:p-5 sm:p-3 relative ${
        pageLoc != "messages" ? "block" : "hidden"
      }`}
    >
      <div className="bg-moment w-screen py-2 rounded-xl border-[#474748] border fixed bottom-0 left-1 mb-5 flex">
        <div className="text-white text-lg flex w-screen justify-between items-center py-2 px-5">
          <button
            className="flex gap-2 items-center font-semibold"
            onClick={() => navigate("/home")}
          >
            <FiHome />
          </button>
          <button
            className="flex gap-2 items-center"
            onClick={() => navigate("/search")}
          >
            <FaSearch />
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
          </button>
          {/* <button
            className="flex gap-2 items-center"
            onClick={() => navigate("/gallery")}
          >
            <TfiGallery />
          </button> */}
          <button
            className="flex gap-2 items-center "
            onClick={() => navigate("/settings")}
          >
            <IoMdSettings />
          </button>
          <div
            className="relative flex  items-center gap-2 cursor-pointer"
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            <Avatar className="z-10">
              <AvatarImage
                src={user.avatarPath}
                className="rounded-full h-8 w-8 "
              />
              <AvatarFallback className="rounded-full bg-slate-400  p-2">
                {user.userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute blur-md">
              <Avatar>
                <AvatarImage
                  src={user.avatarPath}
                  className="rounded-full h-8 w-8 "
                />
                <AvatarFallback className="rounded-full bg-slate-400  p-2">
                  {user.userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBar;
