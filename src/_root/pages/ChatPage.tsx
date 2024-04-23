import ChatSidebar from "@/components/shared/ChatSidebar";
import MessageContainer from "@/components/shared/MessageContainer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const conversation = useSelector((state: any) => state.conversation);
  const [isselected, setIsSelected] = useState(false);
  useEffect(() => {
    if (conversation != null) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
    console.log(conversation);
    console.log(isselected);
  }, [conversation]);
  return (
    <div className="flex w-full bg-secondary text-white h-full overflow-clip ">
      <div
        className={`my-5 lg:h-[635px] h-screen w-full lg:block ${
          !isselected ? "block" : "hidden"
        }`}
      >
        <ChatSidebar />
      </div>
      {/* <div className="my-5 h-[635px] lg:hidden block">
        <ChatSidebar />
      </div> */}
      <div
        className={`my-5 lg:h-[635px] sm:h-[500px] w-full lg:block ${
          isselected ? "block" : "hidden"
        }`}
      >
        <MessageContainer />
      </div>
    </div>
  );
};

export default ChatPage;
