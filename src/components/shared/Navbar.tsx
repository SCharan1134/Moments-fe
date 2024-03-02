import { setLogout } from "@/state";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";

const Navbar = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <div>Moments</div>
        <div>Navigation</div>
        <div>
          <Button onClick={() => dispatch(setLogout())}>Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
