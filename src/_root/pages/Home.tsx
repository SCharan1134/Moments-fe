import CreateMoment from "@/components/shared/CreateMoment";
import { useSelector } from "react-redux";

const Home: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);

  return (
    <div>
      <div>
        <CreateMoment />
      </div>
    </div>
  );
};

export default Home;
