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
  isArchive?: boolean;
  refreshKey?: any;
}

const MomentsWidget: React.FC<MomentsWidgetProps> = ({
  userId,
  isProfile = false,
  isFriends = false,
  isArchive = false,
  refreshKey,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const moments = useSelector((state: any) => state.moments);
  const [key, setKey] = useState(0);

  const getMoments = async () => {
    try {
      // if (userId) {
      console.log(userId);
      const response = await axios.get(
        `http://localhost:3001/moments/${userId}/feed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);

      dispatch(setMoments({ moments: response.data }));
      // }
    } catch (error) {
      console.log("error while getting user moments", error);
    }
  };

  const getFriendMoments = async () => {
    try {
      if (userId) {
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
      }
    } catch (error) {
      console.log("error while getting user moments", error);
    }
  };

  const getArchiveMoments = async () => {
    const response = await axios.get(
      `http://localhost:3001/moments/${userId}/archive`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response);

    dispatch(setMoments({ moments: response.data }));
  };

  const getUserMoments = async () => {
    try {
      if (userId) {
        const response = await axios.get(
          `http://localhost:3001/moments/${userId}/${user._id}/moments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(setMoments({ moments: response.data }));
      }
    } catch (error) {
      console.log("error while getting user moments", error);
    }
  };

  useEffect(() => {
    if (isArchive) {
      getArchiveMoments();
    }
    if (isProfile) {
      getUserMoments();
    } else if (isFriends) {
      console.log("refresh key");
      getFriendMoments();
    } else {
      getMoments();
    }
  }, [isProfile, isFriends, userId, token, refreshKey, isArchive, key]);

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
            isArchive={moment.isArchive}
          />
        ))
      ) : (
        <p>No moments to display.</p>
      )}
    </div>
  );
};

export default MomentsWidget;
