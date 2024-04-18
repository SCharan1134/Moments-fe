import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";

const Conversations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3001/users/search/user/${user._id}`,
          { query: searchTerm },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching:", error);
      }
    };

    if (searchTerm) {
      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, token]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const { loading, conversations } = useGetConversations();
  return (
    <div className="py-2 flex flex-col gap-1 overflow-auto">
      <div className="mb-3">
        <input
          className="bg-[#363536] border-[#494949] text-[#8B8B8B] py-2 px-5 w-full rounded-lg focus:outline-none"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <div>
        {searchResults.length > 0
          ? searchResults.map((conversation: any, idx) => (
              <Conversation
                key={conversation._id}
                id={conversation._id}
                username={conversation.userName}
                avatarpath={conversation.avatarPath}
                lastIdx={idx === searchResults.length - 1}
              />
            ))
          : conversations.map((conversation: any, idx) => (
              <Conversation
                key={conversation._id}
                id={conversation._id}
                username={conversation.userName}
                avatarpath={conversation.avatarPath}
                lastIdx={idx === conversations.length - 1}
              />
            ))}
      </div>

      {loading ? (
        <span className="loading loading-spinner mx-auto"></span>
      ) : null}
    </div>
  );
};
export default Conversations;
