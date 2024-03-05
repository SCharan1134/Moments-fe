import FriendSuggestionList from "@/components/shared/FriendSuggestionList";
import Navbar from "@/components/shared/Navbar";
import { Outlet, useLocation } from "react-router-dom";

const RootLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/home";
  return (
    <div className="w-full h-screen flex">
      <div className="w-[250px] flex-none bg-gray-200 overflow-y-auto">
        <Navbar />
      </div>
      <div className="flex-grow overflow-y-auto">
        <Outlet />
      </div>
      {isHomePage && (
        <div className="w-[500px] flex-none bg-gray-200 overflow-y-auto">
          <FriendSuggestionList />
        </div>
      )}
    </div>
  );
};

export default RootLayout;
