import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useSelector } from "react-redux";

const Home: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);

  return (
    <div>
      <div>
        <div>
          <Avatar>
            <AvatarImage
              src={`http://localhost:3001/avatar/${user.avatarPath}`}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p>{user.userName}</p>
          <Button>Edit Profile</Button>
          <Button>View archive</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
