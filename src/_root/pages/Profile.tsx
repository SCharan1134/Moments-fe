import FriendsModal from "@/components/shared/FriendsModal";
import Modal from "@/components/shared/Modal";
import MomentsWidget from "@/components/shared/MomentsWidget";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const [isfriends, setIsFriends] = useState(false);
  const [isarchive, setIsarchive] = useState(false);
  const [isRequest, setIsRequest] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const moments = useSelector((state: any) => state.moments);

  useEffect(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, [isarchive]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3001/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      setIsLoading(false);
      if (response.data.friends.includes(currentUser._id)) {
        setIsFriends(true);
      }
      if (response.data.friendRequests.includes(currentUser._id)) {
        setIsRequest(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleAddFriend = async () => {
    try {
      if (!isRequest) {
        const response = await axios.patch(
          `http://localhost:3001/friends/${currentUser._id}/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsRequest(true);
        toast({
          duration: 2000,
          description: response.data.message,
        });
        console.log("friend request sent", response);
      } else {
        const response = await axios.patch(
          `http://localhost:3001/friends/remove/request/${currentUser._id}/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsRequest(false);
        toast({
          duration: 2000,
          description: response.data.message,
        });
        console.log("friend request removed", response);
      }
    } catch (error: any) {
      toast({
        duration: 2000,
        variant: "destructive",
        description: error?.response.data.message,
      });
      console.error("Error submitting form:", error);
    }
  };

  const removeFriend = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/friends/remove/${currentUser._id}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        duration: 2000,
        description: response.data.message,
      });
      console.log("friend removed", response);
      setIsFriends(false);
    } catch (error: any) {
      toast({
        duration: 2000,
        variant: "destructive",
        description: error?.response.data.message,
      });
      console.error("Error submitting form:", error);
    }
  };

  const handleFriendButton = async () => {
    if (isfriends) {
      removeFriend();
    } else {
      handleAddFriend();
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    fetchUser();
    if (userId == currentUser._id) {
      setIsCurrent(true);
    } else {
      setIsCurrent(false);
    }
  }, [userId, token, isarchive]);

  return (
    <div className="flex w-full items-start bg-secondary text-white">
      {!isLoading ? (
        <>
          <div className=" w-full pb-20 pt-5">
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
          <div className="w-[650px] w-max-[650px]  rounded-xl sticky top-0 h-screen  mx-5">
            <div className="border border-[#474748] bg-moment w-full h-full my-5 rounded-xl mb-20 p-5">
              <div className="rounded-2xl relative">
                {user.avatarPath == " " ? (
                  <div className="rounded-2xl w-full h-72 flex items-center justify-center border border-[#474748]">
                    {" "}
                    No profile pic
                  </div>
                ) : (
                  <img
                    src={user.avatarPath}
                    className="object-cover rounded-2xl w-full h-64"
                  />
                )}

                <div className="absolute bottom-0 right-0  bg-moment rounded-tl-2xl px-2 py-1 flex flex-col items-center">
                  <div className="font-semibold ">{moments.length}</div>
                  <div>Moments</div>
                </div>
              </div>
              <div className="py-3 px-3 ">
                <div className="flex flex-col">
                  <div className="text-2xl font-semibold">{user?.userName}</div>
                  <div
                    className="flex items-center gap-2 mt-3 cursor-pointer"
                    onClick={() => setShowModal(true)}
                  >
                    <div className="text-md font-light">Friends</div>
                    <div className="text-md font-semibold">
                      {user.friends.length}
                    </div>
                  </div>
                </div>
                {isCurrent && (
                  <Button
                    className="mt-3"
                    onClick={() => {
                      setIsarchive(!isarchive);
                    }}
                  >
                    {isarchive ? "view all" : "view archive"}
                  </Button>
                )}
                {!isCurrent && (
                  <div className="flex w-1/2 items-center justify-between mt-3">
                    <Button
                      onClick={handleFriendButton}
                      className="bg-[#303031] border border-[#59595A]"
                    >
                      {/* {isfriends
                        ? "remove friend"
                        : isRequest
                        ? "remove request"
                        : "add friend"} */}
                      {isfriends
                        ? "friends"
                        : isRequest
                        ? "remove request"
                        : "add friend"}
                    </Button>
                    <Button
                      // onClick={handleFriendButton}
                      className="bg-[#303031] border border-[#59595A]"
                    >
                      Message
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {showModal && (
            <FriendsModal userId={user._id} onClose={closeModal}>
              <Button onClick={closeModal}>close</Button>
            </FriendsModal>
          )}
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default ProfilePage;
