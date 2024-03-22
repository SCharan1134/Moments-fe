import MomentsWidget from "@/components/shared/MomentsWidget";
import { useSelector } from "react-redux";
import FriendSuggestionList from "@/components/shared/FriendSuggestionList";

const Home: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  return (
    <div className="flex w-full items-start">
      <div className="w-full pb-20 px-10 pt-10">
        <div className="flex w-full justify-between items-center pb-5">
          <div className="text-xl font-bold">Feed</div>
          <div className="flex justify-between items-center gap-5">
            <button className="text-primary">Recent</button>
            <button className="text-gray-400">Friends</button>
            <button className="text-gray-400">Recommended</button>
          </div>
        </div>
        <MomentsWidget userId={user._id} />
      </div>
      <div className="w-[650px] border-l border-black sticky top-0 h-screen px-2">
        <FriendSuggestionList />
      </div>
    </div>
  );
};

export default Home;
