import { useSocketContext } from "@/context/SocketContext";
import { setMoments } from "@/state";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const useListenMoment = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const pageLoc = location.pathname.substring(1);

  const { socket } = useSocketContext();
  const moments = useSelector((state: any) => state.moments);
  useEffect(() => {
    socket?.on("newMoment", (moment: any) => {
      if (pageLoc == "home") {
        dispatch(setMoments({ moments: [moment, ...moments] }));
      }
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [socket, setMoments, moments]);
};

export default useListenMoment;
