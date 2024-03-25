import MomentsWidget from "@/components/shared/MomentsWidget";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  avatarPath: string;
  friends: string[];
}

const ProfilePage = () => {
  const { userId } = useParams();
  const userIdString = userId ? String(userId) : "";
  const token = useSelector((state: any) => state.token);

  const currentUser = useSelector((state: any) => state.user);
  const [user, setUser] = useState<User>({
    _id: "",
    firstName: "string",
    lastName: "string",
    userName: "",
    email: "",
    avatarPath: "",
    friends: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const [isfriends, setIsFriends] = useState(false);
  const [isarchive, setIsarchive] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const moments = useSelector((state: any) => state.moments);

  useEffect(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, [isarchive]);

  const fetchUser = async () => {
    setIsLoading(true);
    axios
      .get(`http://localhost:3001/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setIsLoading(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(true);
      });

    return "completed";
  };

  useEffect(() => {
    console.log(fetchUser());
    if (userId == currentUser._id) {
      setIsCurrent(true);
    } else {
      setIsCurrent(false);
    }
    if (user.friends.includes(currentUser._id)) {
      setIsFriends(true);
    }
  }, [userId, token, isarchive]);

  return (
    <div className="flex w-full items-start ">
      {isLoading ? (
        <>
          <div className=" w-full pb-20 pt-10">
            {isCurrent ? (
              <>
                <MomentsWidget
                  userId={currentUser._id}
                  isProfile={true}
                  isFriends={false}
                  isArchive={isarchive}
                  refreshKey={refreshKey}
                />
              </>
            ) : (
              <MomentsWidget
                userId={user._id}
                isProfile={true}
                isFriends={false}
              />
            )}
          </div>
          <div className="w-[650px] w-max-[650px] border-l border-black sticky top-0 h-screen px-5 py-5">
            <div className="rounded-2xl relative">
              {user.avatarPath == " " ? (
                <div className="rounded-2xl w-full h-72 flex items-center justify-center border-2">
                  {" "}
                  No profile pic
                </div>
              ) : (
                <img
                  src={`http://localhost:3001/avatar/${user.avatarPath}`}
                  className="object-cover rounded-2xl w-full h-72"
                />
              )}

              <div className="absolute bottom-0 right-0 bg-secondary rounded-tl-2xl px-2 py-1 flex flex-col items-center">
                <div className="font-semibold">{moments.length}</div>
                <div>Moments</div>
              </div>
            </div>
            <div className="py-3 px-3 ">
              <div className="flex flex-col">
                <div className="text-2xl font-semibold">{user?.userName}</div>
                <div className="flex items-center gap-2">
                  <div className="text-md">Friends</div>
                  <div className="text-md font-semibold">
                    {user.friends.length}
                  </div>
                </div>
              </div>
              {isCurrent && (
                <Button
                  onClick={() => {
                    setIsarchive(!isarchive);
                  }}
                >
                  {isarchive ? "view all" : "view archive"}
                </Button>
              )}
              {!isCurrent && (
                <div className="flex w-1/2 items-center justify-between">
                  <Button>{isfriends ? "remove" : "add friend"}</Button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default ProfilePage;
