"use client";

import RoomGridItem, { RoomGridItemSkeleton } from "@/components/room";
import ToggleDarkMode from "@/components/toggle-dark-mode";
import { Button } from "@/components/ui/button";
import {
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useGetRoomsQuery,
} from "@/lib/services/rooms-service";
import { LucidePlus } from "lucide-react";

export default function RoomPage() {
  const roomsQuery = useGetRoomsQuery();
  const createRoomMutation = useCreateRoomMutation();
  const deleteRoomMutaion = useDeleteRoomMutation();

  return (
    <div className="flex flex-col p-4 items-start">
      <ToggleDarkMode />

      <div className="text-2xl font-bold mt-16">Welcome to MessExpress™</div>

      <Button
        className="my-6"
        disabled={createRoomMutation.isPending}
        onClick={() =>
          createRoomMutation.mutate({
            name: "ABC",
            width: 123,
            height: 123,
          })
        }
      >
        New Room <LucidePlus />
      </Button>

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
