import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PendingRequest from "./PendingRequest";

const Notification = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Notifications</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Pending Requests</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <PendingRequest />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Friend Requests</DropdownMenuLabel>
        <DropdownMenuItem>
          <PendingRequest />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
