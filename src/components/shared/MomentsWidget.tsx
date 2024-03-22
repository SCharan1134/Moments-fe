import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setMoments } from "@/state";
import Moment from "./Moment";

interface MomentsWidgetProps {
  userId: string;
  isProfile?: boolean;
}

const MomentsWidget: React.FC<MomentsWidgetProps> = ({
  userId,
  isProfile = false,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.token);
  const moments = useSelector((state: any) => state.moments);

  const getMoments = async () => {
    const response = await axios.get(`http://localhost:3001/moments/feed`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);

    dispatch(setMoments({ moments: response.data }));
  };

  const getUserMoments = async () => {
    const response = await axios.get(
      `http://localhost:3001/moments/${userId}/moments`,
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
    } else {
      getMoments();
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      {moments.map((moment: any) => (
        <Moment
          postId={moment._id}
          key={moment._id}
          postUserId={moment.userId}
          momentPath={moment.momentPath}
          description={moment.description}
          visibility={moment.visibility}
          likes={moment.likes}
        />
      ))}
    </div>
  );
};

export default MomentsWidget;
