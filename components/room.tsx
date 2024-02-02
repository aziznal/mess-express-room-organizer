import { Room } from "@/lib/type-helpers";
import { LucideMoreHorizontal } from "lucide-react";
import { forwardRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RoomGridItemProps = React.HTMLAttributes<HTMLDivElement> & {
  room: Room;
};

const RoomGridItem = forwardRef<HTMLDivElement, RoomGridItemProps>(
  ({ room, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className="w-full group sm:w-[250px] hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors p-4 rounded-md"
      >
        <div className="h-[200px] w-full bg-white border-2 rounded-md group-hover:bg-slate-100 dark:group-hover:bg-slate-400 transition-colors" />

        <div className="mt-2 text-lg flex justify-between">
          <span className="text-ellipsis whitespace-nowrap overflow-x-clip ">
            {room.name}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <LucideMoreHorizontal className="w-fit shrink-0 " />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
);

RoomGridItem.displayName = "RoomGridItem";

export default RoomGridItem;
