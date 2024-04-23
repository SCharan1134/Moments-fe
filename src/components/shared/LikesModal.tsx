import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import FriendTemplate from "./FriendTemplate";
import { api } from "@/apis/apiGclient";

interface ModalProps {
  children: ReactNode;
  momentId: string;
  onClose: () => void;
}

const LikesModal: React.FC<ModalProps> = ({ momentId, onClose }) => {
  const token = useSelector((state: any) => state.token);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${api}/moments/${momentId}/emojis`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriends(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-3 rounded-lg w-1/3">
        <button
          className="absolute top-5 right-5 z-30  text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="font-bold text-2xl py-4">Friends</h2>
        <div className="h-44 overflow-y-scroll scrollbar-hide">
          {friends.length > 0 ? (
            friends.map((friend: any) => (
              <FriendTemplate
                key={friend._id}
                userId={friend._id}
                avatarPath={friend.avatarPath}
                userName={friend.userName}
                reacts={true}
                emoji={friend.emoji}
              />
            ))
          ) : (
            <div>No User Found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesModal;
