import AvatarPic from "./AvatarPic";

const TopNavbar = () => {
  return (
    <div className="flex w-full h-16 justify-between items-center bg-white px-24 py-5">
      <div>Moments</div>
      <div className="flex gap-20 items-center">
        <div>Notifications</div>
        <AvatarPic />
      </div>
    </div>
  );
};

export default TopNavbar;
