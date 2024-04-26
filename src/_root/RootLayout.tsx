import SideNavbar from "@/components/shared/SideNavbar";
import TopNavbar from "@/components/shared/TopNavbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import CreateMoment from "@/components/shared/CreateMoment";
import { useEffect, useState } from "react";
import MobileBar from "@/components/shared/MobileBar";
import useListenMessages from "@/hooks/useListenMessages";
// import CreateMemory from "@/components/shared/CreateMemory";

const RootLayout = () => {
  const [isCreateMomentOpen, setIsCreateMomentOpen] = useState(false);
  useListenMessages();
  // Function to open the Create Moment modal
  const openCreateMomentModal = () => {
    setIsCreateMomentOpen(true);
  };

  // Function to close the Create Moment modal
  const closeCreateMomentModal = () => {
    setIsCreateMomentOpen(false);
  };

  useEffect(() => {
    // Disable scrolling on the body when the modal is open
    if (isCreateMomentOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [isCreateMomentOpen]);
  return (
    <div className=" w-full relative overflow-hidden bg-secondary text-white lg:px-5 px-0">
      <div className="sticky top-0 z-10 w-full  ">
        <TopNavbar openCreateMomentModal={openCreateMomentModal} />
      </div>
      <div className="h-screen lg:flex flex-none w-full">
        <div className={`w-[250px] flex-none hidden lg:block`}>
          <SideNavbar />
        </div>
        <div
          className={`w-full flex-none lg:hidden block sticky bottom-0 z-10`}
        >
          <MobileBar />
        </div>
        <div className="flex-grow overflow-y-auto scrollbar-hide h-full">
          <Outlet />
        </div>
      </div>
      {isCreateMomentOpen && <CreateMoment onClose={closeCreateMomentModal} />}
      <Toaster />
    </div>
  );
};

export default RootLayout;
