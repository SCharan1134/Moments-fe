import { api } from "@/apis/apiGclient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { isAllOf } from "@reduxjs/toolkit";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsloading(true);
        const response = await axios.post(
          `${api}/users/search/user/${user._id}`,
          { query: searchTerm },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults(response.data);
        setIsloading(false);
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
    <div className=" text-white bg-secondary w-full h-full">
      <div className="px-5 py-10">
        <div className="text-3xl font-semibold">Search </div>
        <div className="px-5 py-5">
          <input
            className="bg-[#363536] border-[#494949] text-[#8B8B8B] py-2 px-5 lg:w-[500px] w-full rounded-lg focus:outline-none"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleInputChange}
          />
          <div className="py-5">
            {isloading ? (
              <div className="w-[500px] flex flex-col gap-5">
                <div className="space-y-2 w-full  flex gap-2 p-5 bg-moment rounded-lg">
                  <Skeleton className="h-12 w-12 bg-secondary rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-2 w-[250px] bg-secondary" />
                    <Skeleton className="h-1 w-[200px] bg-secondary" />
                  </div>
                </div>
                <div className="space-y-2 w-full flex gap-2 p-5 bg-moment">
                  <Skeleton className="h-12 w-12 bg-secondary rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-2 w-[250px] bg-secondary" />
                    <Skeleton className="h-1 w-[200px] bg-secondary" />
                  </div>
                </div>
                <div className="space-y-2 w-full flex gap-2 p-5 bg-moment">
                  <Skeleton className="h-12 w-12 bg-secondary rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-2 w-[250px] bg-secondary" />
                    <Skeleton className="h-1 w-[200px] bg-secondary" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {searchResults.length > 0 ? (
                  searchResults.map((result: any) => (
                    <div key={result._id}>
                      <div className="flex justify-between items-center p-2 border lg:w-[500px] w-full my-3 rounded-xl border-[#474748] bg-[#19191A]">
                        <div
                          className="flex gap-5 cursor-pointer items-center w-full"
                          onClick={() => navigate(`/profile/${result._id}`)}
                        >
                          <Avatar>
                            <AvatarImage src={result.avatarPath} />

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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
