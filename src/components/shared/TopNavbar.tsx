import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

import AvatarPic from "./AvatarPic";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "@/state";
import { DropdownMenuGroup } from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { Button } from "../ui/button";

interface TopNavbarProps {
  openCreateMomentModal: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ openCreateMomentModal }) => {
  const { userName, _id } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex w-full h-[70px] justify-between items-center px-3 py-5 ">
      <div className="bg-moment flex w-full justify-between items-center px-10 py-2 rounded-xl border-[#474748] border">
        <div
          onClick={() => navigate("/home")}
          className=" cursor-pointer text-2xl font-bold text-primary"
        >
          Moments
        </div>
        <div className="flex gap-10 items-center">
          <div>
            <Button onClick={openCreateMomentModal} className="px-3">
              Create Moment
            </Button>
          </div>
          <div className="text-white">
            <Notification />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AvatarPic />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-34 bg-white p-2 border border-black rounded-md px-5">
              <DropdownMenuLabel className="py-1">{userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="py-1 cursor-pointer"
                  onClick={() => navigate(`/profile/${_id}`)}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="py-1 cursor-pointer"
                  onClick={() => navigate("/settings")}
                >
                  Edit Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 py-1 cursor-pointer"
                onClick={() => dispatch(setLogout())}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
