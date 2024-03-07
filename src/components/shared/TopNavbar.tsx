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

const TopNavbar = () => {
  const { userName } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex w-full h-16 justify-between items-center bg-white px-24 py-5">
      <div onClick={() => navigate("/home")} className=" cursor-pointer">
        Moments
      </div>
      <div className="flex gap-20 items-center">
        <div>Notifications</div>
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
                onClick={() => navigate("/profile")}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="py-1 cursor-pointer"
                onClick={() => navigate("/settings")}
              >
                Settings
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
