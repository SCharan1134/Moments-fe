import CreateMoment from "@/components/shared/CreateMoment";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSelector } from "react-redux";

const Home: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Create Moment</Button>
      </DialogTrigger>
      <DialogContent>
        <CreateMoment />
      </DialogContent>
    </Dialog>
  );
};

export default Home;
