import { setLogout } from "@/state";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const SideNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col">
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
      </div>
      <div>
        <Button onClick={() => dispatch(setLogout())}>Logout</Button>
      </div>
    </div>
  );
};

export default SideNavbar;
