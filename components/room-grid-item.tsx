import { Room } from "@/lib/type-helpers";
import { LucideMoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "./ui/skeleton";
import { useUpdateRoomMutation } from "@/lib/services/rooms-service";
import UpdateRoom from "./update-room";
import { useToast } from "./ui/use-toast";
import Link from "next/link";

type RoomGridItemProps = {
  room: Room;
  onDeleted: () => void;
};

export const RoomGridItem = ({ room, onDeleted }: RoomGridItemProps) => {
  const updateRoomMutation = useUpdateRoomMutation();

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();

  return (
    <div className="w-full group sm:w-[250px]">
      <Link href={`/editor/${room.id}`}>
        <div className="relative h-[200px] w-full bg-white border-2 rounded-md group-hover:bg-slate-100 dark:group-hover:bg-slate-400 transition-colors">
          <span className="absolute bottom-2 right-2 text-xs text-slate-400">
            {room.width}x{room.height}
          </span>
        </div>
      </Link>

      <div className="mt-2 text-lg flex justify-between">
        <span className="text-ellipsis whitespace-nowrap overflow-x-clip ">
          {room.name}
        </span>

        <UpdateRoom
          disabled={updateRoomMutation.isPending}
          isLoading={updateRoomMutation.isPending}
          onRoomUpdated={async (updatedRoom) => {
            await updateRoomMutation.mutateAsync({
              id: room.id,
              updatedRoom,
            });
            toast({ title: "Room updated succesfully" });
          }}
          isDialogOpen={isUpdateDialogOpen}
          setIsDialogOpen={setIsUpdateDialogOpen}
          room={room}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                room.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                onClick={() => onDeleted()}
                className="bg-red-500 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <LucideMoreHorizontal className="w-fit shrink-0 " />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Settings</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

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
