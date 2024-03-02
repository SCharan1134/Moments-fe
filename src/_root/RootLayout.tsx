import Navbar from "@/components/shared/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between w-96">
        <div>
          <Navbar />
        </div>
        <Outlet />
        <div>friendsuggestions</div>
      </div>
    </div>
  );
};

export default RootLayout;
