import Navbar from "@/components/shared/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full px-5 py-3">
      <div className="flex justify-between">
        <div className="basis-1/4">
          <Navbar />
        </div>
        <div className="w-full">
          <Outlet />
        </div>
        <div className="basis-1/3">friendsuggestions</div>
      </div>
    </div>
  );
};

export default RootLayout;
