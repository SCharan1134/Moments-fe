import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";

const PendingRequest = () => {
  return (
    <div className="flex w-full justify-between items-center px-2 py-1">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={`http://localhost:3001/avatar/`} />
          <AvatarFallback>
            <img src="https://github.com/shadcn.png" />
          </AvatarFallback>
        </Avatar>
        <p>hi</p>
      </div>
      <Button>{true ? " sent" : "add Friend"}</Button>
    </div>
  );
};

export default PendingRequest;
