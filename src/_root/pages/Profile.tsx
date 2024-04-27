import { api } from "@/apis/apiGclient";
import FriendsModal from "@/components/shared/FriendsModal";
import Modal from "@/components/shared/Modal";
import MomentsWidget from "@/components/shared/MomentsWidget";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { changeUserDetails } from "@/state";
import axios from "axios";
import { useSocketContext } from "@/context/SocketContext";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const dispatch = useDispatch();
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
      const response = await axios.get(`${api}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleAddFriend = async () => {
    try {
      if (!isRequest) {
        const response = await axios.patch(
          `${api}/friends/${currentUser._id}/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsRequest(true);
        let updatedUser = { ...currentUser };
        updatedUser.friendRequests = response.data.friendRequests;
        dispatch(changeUserDetails({ user: updatedUser }));
        console.log("friend request sent", response);
      } else {
        const response = await axios.patch(
          `${api}/friends/remove/request/${currentUser._id}/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsRequest(false);
        dispatch(changeUserDetails({ user: response.data }));
        // toast({
        //   duration: 2000,
        //   description: response.data.message,
        // });
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
        `${api}/friends/remove/${currentUser._id}/${userId}`,
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
      dispatch(changeUserDetails({ user: response.data }));
      console.log("friend removed", response);
      setIsFriends(false);
      setIsRequest(false);
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

  const { socket } = useSocketContext();

  useEffect(() => {
    socket?.on("removeFriend", (friendid) => {
      const updatedUser = { ...user };
      updatedUser.friends = updatedUser.friends.filter(
        (friendId: any) => friendId !== friendid
      );
      setIsFriends(false);
      setIsRequest(false);
      dispatch(changeUserDetails({ user: updatedUser }));
    });
    return () => socket?.off("removeFriend");
  }, [socket]);

  useEffect(() => {
    if (currentUser.friends.includes(userId)) {
      setIsFriends(true);
    }
    if (currentUser.pendingFriends.includes(userId)) {
      setIsRequest(true);
    }
  }, [userId, token, isarchive, currentUser, socket]);

  return (
    <div className="lg:flex-row flex flex-col-reverse w-full items-start bg-secondary text-white">
      {!isLoading ? (
        <>
          <div className=" w-full lg:pb-20 pb-48 pt-5">
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
          <div className="lg:w-[650px] w-max-[650px] w-full rounded-xl lg:sticky top-0 lg:h-screen  lg:mx-5">
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
                    {isCurrent ? (
                      <div className="text-md font-semibold">
                        {currentUser.friends.length}
                      </div>
                    ) : (
                      <div className="text-md font-semibold">
                        {user.friends.length}
                      </div>
                    )}
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
