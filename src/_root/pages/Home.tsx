import MomentsWidget from "@/components/shared/MomentsWidget";
import { useDispatch, useSelector } from "react-redux";
import FriendSuggestionList from "@/components/shared/FriendSuggestionList";
import { useEffect, useState } from "react";
import MainBar from "@/components/shared/MainBar";
import { setMoments } from "@/state";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [isFriend, setIsFriend] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    setRefreshKey((prevKey) => prevKey + 1); // Update refresh key
  }, [isFriend]);
  return (
    <div className="relative flex w-full items-start bg-secondary">
      <div className="w-full pt-5">
        <div className="flex w-full justify-between items-center p-3 bg-moment rounded-xl border-[#474748] border mb-5">
          <div className="text-xl font-bold text-white">Feed</div>
          <div className="flex justify-between items-center gap-5">
            <button
              className={`${!isFriend ? "text-primary" : "text-white"}`}
              onClick={() => {
                dispatch(setMoments({ moments: [] }));
                setIsFriend(false);
              }}
            >
              all
            </button>
            <button
              className={`${isFriend ? "text-primary" : "text-white"}`}
              onClick={() => {
                dispatch(setMoments({ moments: [] }));
                setIsFriend(true);
              }}
            >
              Friends
            </button>
          </div>
        </div>
        <div className="lg:pb-24 pb-36">
          <MomentsWidget
            userId={user._id}
            isFriends={isFriend}
            refreshKey={refreshKey} // Pass refresh key to MomentsWidget
          />
        </div>
      </div>
      <div className="hidden lg:block sticky w-[650px] w-max-[650px] top-0 h-screen bg-secondary">
        <MainBar />
      </div>
    </div>
  );
};

export default Home;
