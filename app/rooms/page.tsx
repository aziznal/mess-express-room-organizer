"use client";

import CreateNewRoom from "@/components/create-new-room";
import RoomGridItem, { RoomGridItemSkeleton } from "@/components/room";
import ToggleDarkMode from "@/components/toggle-dark-mode";
import {
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useGetRoomsQuery,
  useUpdateRoomMutation,
} from "@/lib/services/rooms-service";
import { NewRoom } from "@/lib/type-helpers";
import { useToast } from "@/components/ui/use-toast";

export default function RoomPage() {
  const roomsQuery = useGetRoomsQuery();
  const createRoomMutation = useCreateRoomMutation();
  const deleteRoomMutaion = useDeleteRoomMutation();

  const { toast } = useToast();

  return (
    <div className="flex flex-col p-4 items-start">
      <ToggleDarkMode />

      <div className="text-2xl font-bold mt-16">Welcome to MessExpress™</div>

      <CreateNewRoom
        disabled={createRoomMutation.isPending}
        isLoading={createRoomMutation.isPending}
        onNewRoomCreated={async (newRoom: NewRoom) => {
          await createRoomMutation.mutateAsync(newRoom);
          toast({
            title: "Room created succesfully",
          });
        }}
      />

      {/*  Room Grid */}
      <div className="mt-12 w-full flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-0">
        {roomsQuery.isLoading && (
          <>
            <RoomGridItemSkeleton />
            <RoomGridItemSkeleton />
            <RoomGridItemSkeleton />
            <RoomGridItemSkeleton />
            <RoomGridItemSkeleton />
            <RoomGridItemSkeleton />
            <RoomGridItemSkeleton />
          </>
        )}

        {roomsQuery.data?.map((room) => (
          <RoomGridItem
            key={room.id}
            room={room}
            onDeleted={async () => {
              await deleteRoomMutaion.mutateAsync(room.id);
              toast({
                title: "Room deleted succesfully",
                variant: "destructive",
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}
