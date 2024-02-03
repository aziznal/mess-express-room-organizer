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
import { Skeleton } from "./ui/skeleton";
import { useDeleteRoomMutation } from "@/lib/services/rooms-service";

type RoomGridItemProps = React.HTMLAttributes<HTMLDivElement> & {
  room: Room;
  onDelete: () => void;
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

              <DropdownMenuItem onClick={props.onDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
);

RoomGridItem.displayName = "RoomGridItem";

export default RoomGridItem;

export const RoomGridItemSkeleton = () => {
  return (
    <Skeleton className="w-full sm:w-[250px] p-4 rounded-md">
      <Skeleton className="h-[200px] w-full bg-white border-2 rounded-md " />

      <Skeleton className="mt-2 text-lg flex justify-between">
        <Skeleton className="h-4 bg-slate-300 w-24" />
      </Skeleton>
    </Skeleton>
  );
};
