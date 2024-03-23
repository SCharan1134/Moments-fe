import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setMoments } from "@/state";
import Moment from "./Moment";

interface MomentsWidgetProps {
  userId: string;
  isProfile?: boolean;
  isAll?: boolean;
  isFriends?: boolean;
  refreshKey?: any;
}

const MomentsWidget: React.FC<MomentsWidgetProps> = ({
  userId,
  isProfile = false,
  isFriends = false,
  refreshKey,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const moments = useSelector((state: any) => state.moments);
  const [key, setKey] = useState(0);

  const getMoments = async () => {
    const response = await axios.get(
      `http://localhost:3001/moments/${userId}/feed`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);

    dispatch(setMoments({ moments: response.data }));
  };
  const getFriendMoments = async () => {
    const response = await axios.get(
      `http://localhost:3001/moments/${userId}/feed/friend`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);

    dispatch(setMoments({ moments: response.data }));
  };

  const getUserMoments = async () => {
    const response = await axios.get(
      `http://localhost:3001/moments/${userId}/${user._id}/moments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(setMoments({ moments: response.data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserMoments();
    } else if (isFriends) {
      getFriendMoments();
    } else {
      getMoments();
    }
  }, [isProfile, isFriends, userId, token, refreshKey]);

  useEffect(() => {
    // When refreshKey changes, update the local key state to trigger a re-render
    setKey((prevKey) => prevKey + 1);
  }, [refreshKey]);

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      {moments.length > 0 ? (
        moments.map((moment: any) => (
          <Moment
            postId={moment._id}
            key={moment._id}
            postUserId={moment.userId}
            momentPath={moment.momentPath}
            description={moment.description}
            visibility={moment.visibility}
            likes={moment.likes}
          />
        ))
      ) : (
        <p>No moments to display.</p>
      )}
    </div>
  );
};

export default MomentsWidget;
