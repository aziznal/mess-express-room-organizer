"use client";

import { LucideArrowLeft, LucideLoader2, LucidePlus } from "lucide-react";
import { useGetRoomByIdQuery } from "@/lib/services/rooms-service";
import FabricCanvas from "@/components/fabric-canvas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  usePlaceItemToRoomMutation,
  useCreateItemMutation,
  useDeleteItemMutation,
  useGetItemsQuery,
  useGetPlacedItemsByRoomId,
  useUpdatePlacedItemMutation,
  useDeletePlacedItemMutation,
} from "@/lib/services/items-service";
import { ListedRoomItem } from "@/components/listed-room-item";
import { useToast } from "@/components/ui/use-toast";
import { UpdatedPlacedItem } from "@/lib/type-helpers";

type EditorProps = {
  params: {
    roomId: string;
  };
};

export const dynamic = "force-dynamic";

export default function Editor(props: EditorProps) {
  const roomQuery = useGetRoomByIdQuery(props.params.roomId);
  const itemsQuery = useGetItemsQuery();
  const roomItemsQuery = useGetPlacedItemsByRoomId(roomQuery.data?.id);

  const createItemMutation = useCreateItemMutation();
  const deleteItemMutation = useDeleteItemMutation();
  const placeItemMutation = usePlaceItemToRoomMutation();
  const updatePlacedItemMutation = useUpdatePlacedItemMutation();
  const deletePlacedItemMutation = useDeletePlacedItemMutation();

  const createAndPlaceItem = async () => {
    if (!roomQuery.data?.id) return;

    const newItem = await createItemMutation.mutateAsync({
      height: 255,
      width: 366,
      name: "Erdem's item",
      backgroundColor: "#ff0000",
    });

    placeItemMutation.mutate({
      roomId: roomQuery.data.id,
      itemId: newItem.id,
      x: 100,
      y: 100,
      zIndex: 1,
    });
  };

  const { toast } = useToast();

  if (roomQuery.isPending) {
    return (
      <div className="h-full flex items-center justify-center gap-2">
        <LucideLoader2 className="animate-spin" /> Loading ...
      </div>
    );
  }

  if (roomQuery.isError) {
    return (
      <div className="h-full flex items-center justify-center gap-2">
        <LucideLoader2 className="animate-spin" /> Error:
        {roomQuery.error.message}
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] flex items-center justify-center flex-col overflow-hidden">
      <div className="bg-slate-900 shadow h-full w-[400px] absolute top-0 left-0 z-50 text-white p-4 flex flex-col gap-4">
        <Link
          href="/rooms"
          className="flex gap-1 opacity-50 hover:opacity-100 text-xs items-center"
        >
          <LucideArrowLeft size="20" />
          Back to dashboard
        </Link>

        <div>{roomQuery.data.name}</div>

        <div className="flex justify-between items-center">
          <h2 className="text-lg">Room Items</h2>

          <Button
            variant="secondary"
            className="text-xs"
            onClick={createAndPlaceItem}
          >
            New Item
            <LucidePlus size="20" />
          </Button>
        </div>

        <hr className="border-slate-400" />

        <div className="flex flex-col overflow-y-auto">
          {itemsQuery.data?.map((item) => (
            <ListedRoomItem
              key={item.id}
              item={item}
              onItemDeleted={async () => {
                await deleteItemMutation.mutateAsync(item.id);
                toast({
                  title: "Item deleted succesfully",
                  variant: "destructive",
                });
              }}
            />
          ))}
        </div>
      </div>

      <FabricCanvas
        room={roomQuery.data}
        roomItems={roomItemsQuery.data ?? []}
        onItemUpdated={({
          itemId,
          item,
        }: {
          itemId: string;
          item: UpdatedPlacedItem;
        }) => {
          updatePlacedItemMutation.mutate({
            roomId: roomQuery.data?.id,
            itemId,
            updatedPlacedItem: item,
          });
        }}
        onItemDeleted={(itemId: string) =>
          deletePlacedItemMutation.mutate({
            itemId: itemId,
            roomId: roomQuery.data.id,
          })
        }
      />
    </div>
  );
}
