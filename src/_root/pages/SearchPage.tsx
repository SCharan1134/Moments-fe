import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const token = useSelector((state: any) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3001/users/search/user`,
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

  return (
    <div className="m-5 px-5">
      <div className="text-3xl font-semibold">Search Users</div>
      <div className="px-5 py-5">
        <input
          className="border-b border-primary bg-secondary "
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <div className="px-3 py-3">
          {searchResults.length > 0 ? (
            searchResults.map((result: any) => (
              <div key={result._id}>
                <div className="flex justify-between items-center p-2">
                  <div
                    className="flex gap-5 cursor-pointer"
                    onClick={() => navigate(`/profile/${result._id}`)}
                  >
                    <Avatar>
                      <AvatarImage
                        src={`http://localhost:3001/avatar/${result.avatarPath}`}
                      />
                      <AvatarFallback>
                        <img
                          src="https://github.com/shadcn.png"
                          alt="avatar fallback"
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div>{result.userName}</div>
                  </div>
                  {/* {reacts ? (
                    <div>{emoji}</div>
                  ) : (
                    currentUser._id !== userId && (
                      <Button onClick={handleFriendButton}>
                        {isfriends
                          ? "friends"
                          : isRequest
                          ? "Remove Request"
                          : "Add Friend"}
                      </Button>
                    )
                  )} */}
                </div>
              </div>
            ))
          ) : (
            <div>No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
