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
    <div className=" relative">
      <div className=" top-5 right-1 bg-moment flex w-full justify-between items-center px-5 py-2 rounded-xl border-[#474748] border">
        <div
          onClick={() => navigate("/home")}
          className="cursor-pointer text-2xl font-bold text-primary"
        >
          Moments
        </div>
        <div className="flex gap-5 items-center">
          <Button
            onClick={openCreateMomentModal}
            className="px-3 flex justify-between"
          >
            <span className="font-bold lg:hidden block">+</span>
            <div className="hidden lg:block">Create Moment</div>
          </Button>
          <div className="text-white">
            <Notification />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AvatarPic />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-34 bg-moment text-white p-2 border border-[#474748] rounded-md px-2 ">
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
