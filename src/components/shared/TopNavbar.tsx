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
    <div className="flex w-full h-14 justify-between items-center px-10 py-5 bg-secondary border-b border-black">
      <div
        onClick={() => navigate("/home")}
        className=" cursor-pointer text-lg font-bold"
      >
        Moments
      </div>
      <div className="flex gap-10 items-center">
        <div>
          <Button onClick={openCreateMomentModal} className="px-5 ">
            Create Moment
          </Button>
        </div>
        <div>
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
  );
};

export default TopNavbar;
