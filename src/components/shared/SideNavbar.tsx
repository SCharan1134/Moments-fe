import { useNavigate } from "react-router-dom";

const SideNavbar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-secondary h-full border-r border-black">
      <div className="text-lg flex flex-col justify-center items-start gap-10 pl-20 py-10">
        <button className="flex items-center" onClick={() => navigate("/home")}>
          {/* <FaHome size={30} className="mr-2" /> */}
          Home
        </button>
        <button
          className="flex items-center"
          onClick={() => navigate("/messages")}
        >
          {/* <FaEnvelope size={30} className="mr-2" /> */}
          Search
        </button>
        <button
          className="flex items-center"
          onClick={() => navigate("/messages")}
        >
          {/* <FaEnvelope size={30} className="mr-2" /> */}
          Time Capsules
        </button>
        <button
          className="flex items-center"
          onClick={() => navigate("/messages")}
        >
          {/* <FaEnvelope size={30} className="mr-2" /> */}
          Messages
        </button>
        <button
          className="flex items-center"
          onClick={() => navigate("/profile")}
        >
          {/* <FaUser size={30} className="mr-2" />p */}
          Gallery
        </button>
        <button
          className="flex items-center"
          onClick={() => navigate("/settings")}
        >
          {/* <FaUser size={30} className="mr-2" />p */}
          Settings
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;
