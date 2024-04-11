import FriendSuggestionList from "./FriendSuggestionList";

const MainBar = () => {
  return (
    <div className="p-5 w-full h-full  pb-20">
      <div className="border px-5 w-full h-full bg-moment rounded-xl  border-[#474748]">
        <FriendSuggestionList />
      </div>
    </div>
  );
};

export default MainBar;
