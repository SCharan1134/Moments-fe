import MomentsWidget from "@/components/shared/MomentsWidget";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const user = useSelector((state: any) => state.user);
  return (
    <div className="flex w-full items-start ">
      <div className=" w-full pb-20">
        <MomentsWidget userId={user._id} isProfile={true} />
      </div>
      <div className="w-[650px] border-l border-black sticky top-0 h-screen">
        Profile
      </div>
    </div>
  );
};

export default ProfilePage;
