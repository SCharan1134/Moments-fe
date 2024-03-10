import { setLogout } from "@/state";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import AvatarPic from "./AvatarPic";
import { FaHome, FaEnvelope, FaUser} from "react-icons/fa";


const SideNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
  <div className="text-xl flex flex-col justify-center items-start gap-10 px-10 py-10">
    <button className="flex items-center" onClick={() => navigate("/home")}>
      <FaHome size = {30} className="mr-2" /> 
      Home
    </button>
    <button className="flex items-center" onClick={() => navigate("/messages")}>
      <FaEnvelope size = {30} className="mr-2" /> 
      Messages
    </button>
    <button className="flex items-center" onClick={() => navigate("/profile")}>
      <FaUser size = {30} className="mr-2" /> 
      Profile
    </button>
  </div> 
</div>
  );
};

export default SideNavbar;
