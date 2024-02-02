import { Room } from "@/lib/type-helpers";
import { LucideMoreHorizontal } from "lucide-react";
import { forwardRef } from "react";

type RoomGridItemProps = React.HTMLAttributes<HTMLDivElement> & {
  room: Room;
};

const RoomGridItem = forwardRef<HTMLDivElement, RoomGridItemProps>(
  ({ room, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className="w-full sm:w-[250px]">
        <div className="h-[200px] w-full bg-white border-2" />

        <div className="mt-2 text-lg flex justify-between">
          <span className="text-ellipsis whitespace-nowrap overflow-x-clip">
            {room.name}
          </span>

          <LucideMoreHorizontal className="w-fit shrink-0" />
        </div>
      </div>
    );
  }
);

RoomGridItem.displayName = "RoomGridItem";

export default RoomGridItem;
