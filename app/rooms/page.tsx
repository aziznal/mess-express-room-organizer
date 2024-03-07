"use client";

import CreateNewRoom from "@/components/create-new-room";
import RoomGridItem, { RoomGridItemSkeleton } from "@/components/room-grid-item";
import ToggleDarkMode from "@/components/toggle-dark-mode";
import {
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useGetRoomsQuery,
} from "@/lib/services/rooms-service";
import { NewRoom } from "@/lib/type-helpers";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function RoomPage() {
  const roomsQuery = useGetRoomsQuery();
  const createRoomMutation = useCreateRoomMutation();
  const deleteRoomMutation = useDeleteRoomMutation();

  const { toast } = useToast();

  const deleteRoom = async (roomId: string) => {
    await deleteRoomMutation.mutateAsync(roomId);

    toast({
      title: "Room deleted succesfully",
      variant: "destructive",
    });
  };

  return (
    <div className="flex flex-col p-4 items-start">
      <ToggleDarkMode />

      <Link className="absolute right-20 top-[30px] hover:underline" href="/roadmap">
        Roadmap
      </Link>

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
      <div className="mt-12 w-full flex flex-col gap-6 sm:flex-row sm:flex-wrap">
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
          <RoomGridItem key={room.id} room={room} onDeleted={() => deleteRoom(room.id)} />
        ))}
      </div>
    </div>
  );
}
