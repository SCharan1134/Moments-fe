import CreateMoment from "@/components/shared/CreateMoment";
import MomentsWidget from "@/components/shared/MomentsWidget";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useSelector } from "react-redux";

const Home: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create Moment</Button>
        </DialogTrigger>
        <DialogContent>
          <CreateMoment />
        </DialogContent>
      </Dialog>
      <div className="w-full">
        <MomentsWidget userId={user._id} />
      </div>
    </>
  );
};

export default Home;
