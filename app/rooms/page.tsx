"use client";

import CreateNewRoom from "@/components/create-new-room";
import RoomGridItem, { RoomGridItemSkeleton } from "@/components/room";
import ToggleDarkMode from "@/components/toggle-dark-mode";
import { Button } from "@/components/ui/button";
import {
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useGetRoomsQuery,
  useUpdateRoomMutation,
} from "@/lib/services/rooms-service";
import { NewRoom } from "@/lib/type-helpers";
export default function RoomPage() {
  const roomsQuery = useGetRoomsQuery();
  const createRoomMutation = useCreateRoomMutation();
  const updateRoomMutation = useUpdateRoomMutation();
  const deleteRoomMutaion = useDeleteRoomMutation();

  return (
    <div className="flex flex-col p-4 items-start">
      <ToggleDarkMode />

      <div className="text-2xl font-bold mt-16">Welcome to MessExpress™</div>

      <CreateNewRoom
        disabled={createRoomMutation.isPending}
        isLoading={createRoomMutation.isPending}
        onNewRoomCreated={async (newRoom: NewRoom) =>
          createRoomMutation.mutateAsync(newRoom)
        }
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
            onDelete={() => {
              deleteRoomMutaion.mutate(room.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
