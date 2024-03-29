import MomentsWidget from "@/components/shared/MomentsWidget";
import { useSelector } from "react-redux";
import FriendSuggestionList from "@/components/shared/FriendSuggestionList";
import { useEffect, useState } from "react";
import MemoryWidget from "@/components/shared/MemoryWidget";
// import MemoryWidget from "@/components/shared/MemoryWidget";

const Home: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const [isFriend, setIsFriend] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    setRefreshKey((prevKey) => prevKey + 1); // Update refresh key
  }, [isFriend]);
  return (
    <div className="flex w-full items-start">
      <div className="w-full pb-20 px-10 pt-10">
        <div className="flex w-full justify-between items-center pb-5">
          <div className="text-xl font-bold">Feed</div>
          <div className="flex justify-between items-center gap-5">
            <button
              className={`${!isFriend ? "text-primary" : "text-gray-400"}`}
              onClick={() => setIsFriend(false)}
            >
              all
            </button>
            <button
              className={`${isFriend ? "text-primary" : "text-gray-400"}`}
              onClick={() => {
                setIsFriend(true);
                console.log(isFriend);
              }}
            >
              Friends
            </button>
          </div>
        </div>
        <MomentsWidget
          userId={user._id}
          isFriends={isFriend}
          refreshKey={refreshKey} // Pass refresh key to MomentsWidget
        />
      </div>
      <div className="w-[650px] w-max-[650px] border-l border-black sticky top-0 h-screen px-2">
        {/* <MemoryWidget /> */}
        <FriendSuggestionList />
      </div>
    </div>
  );
};

export default Home;
