import MomentsWidget from "@/components/shared/MomentsWidget";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateMoment from "@/components/shared/CreateMoment";

const ProfilePage = () => {
  const user = useSelector((state: any) => state.user);
  return (
    <div className="flex w-full items-start">
      <div className=" w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Moment</Button>
          </DialogTrigger>
          <DialogContent>
            <CreateMoment />
          </DialogContent>
        </Dialog>
        <MomentsWidget userId={user._id} isProfile={true} />
      </div>
      <div className=" w-full">Profile</div>
    </div>
  );
};

export default ProfilePage;
