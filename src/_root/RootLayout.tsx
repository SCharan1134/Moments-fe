import FriendSuggestionList from "@/components/shared/FriendSuggestionList";
import SideNavbar from "@/components/shared/SideNavbar";
import TopNavbar from "@/components/shared/TopNavbar";
import { Outlet, useLocation } from "react-router-dom";

const RootLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/home";
  return (
    <div className="w-full relative ">
      <div className="sticky top-0 z-10 w-full ">
        <TopNavbar />
      </div>
      <div className="h-screen  flex">
        <div className="w-[250px] flex-none bg-gray-200 overflow-y-auto">
          <SideNavbar />
        </div>
        <div className="flex-grow overflow-y-auto scrollbar-hide">
          <Outlet />
        </div>
        {isHomePage && (
          <div className="w-[500px] flex-none bg-gray-200 overflow-y-auto">
            <FriendSuggestionList />
          </div>
        )}
      </div>
    </div>
  );
};

export default RootLayout;
