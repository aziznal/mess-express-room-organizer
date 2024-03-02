"use client";

import {
  LucideArrowLeft,
  LucideChevronsLeft,
  LucideLoader2,
  LucidePlus,
} from "lucide-react";
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
  useUpdateItemMutation,
} from "@/lib/services/items-service";
import { ListedRoomItem } from "@/components/listed-room-item";
import { useToast } from "@/components/ui/use-toast";
import { UpdatedPlacedItem, UpdatedRoomItem } from "@/lib/type-helpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParamState } from "@/lib/hooks/useQueryParamState";
import RightMenu from "@/components/right-menu";

type EditorProps = {
  params: {
    roomId: string;
  };
};

export const dynamic = "force-dynamic";

export default function Editor(props: EditorProps) {
  const roomQuery = useGetRoomByIdQuery(props.params.roomId);
  const itemsQuery = useGetItemsQuery();
  const placedItemsQuery = useGetPlacedItemsByRoomId(roomQuery.data?.id);

  const createItemMutation = useCreateItemMutation();
  const updateItemMutation = useUpdateItemMutation();
  const deleteItemMutation = useDeleteItemMutation();
  const placeItemMutation = usePlaceItemToRoomMutation();
  const updatePlacedItemMutation = useUpdatePlacedItemMutation();
  const deletePlacedItemMutation = useDeletePlacedItemMutation();

  const { value: itemTab, setValue: setItemTab } = useQueryParamState({
    key: "itemTab",
    initialValue: "placed-items",
  });

  const { value: selectedItemId, setValue: setSelectedItemId } =
    useQueryParamState({
      key: "selectedItemId",
    });

  const createAndPlaceItem = async () => {
    if (!roomQuery.data?.id) return;

    const newItem = await createItemMutation.mutateAsync({
      height: 50,
      width: 100,
      name: "New Item",
      backgroundColor: "#879977",
    });

    placeItemMutation.mutate({
      roomId: roomQuery.data.id,
      itemId: newItem.id,
      x: 600,
      y: 400,
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
          <Tabs
            defaultValue="placed-items"
            value={itemTab ?? undefined}
            onValueChange={setItemTab}
            className="w-[350px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="placed-items">Placed items</TabsTrigger>
              <TabsTrigger value="listed-items">Listed items</TabsTrigger>
            </TabsList>

            <TabsContent value="listed-items">
              {/* FIXME later for improve performance */}
              {itemsQuery.data
                ?.filter(
                  (item) =>
                    !placedItemsQuery.data
                      ?.map((karpuz) => karpuz.itemId)
                      .includes(item.id)
                )
                .map((item) => (
                  <ListedRoomItem
                    key={item.id}
                    item={item}
                    onClick={() =>
                      placeItemMutation.mutate({
                        roomId: roomQuery.data?.id,
                        itemId: item.id,
                        x: 100,
                        y: 100,
                        zIndex: 1,
                      })
                    }
                    onItemDeleted={async () => {
                      await deleteItemMutation.mutateAsync(item.id);
                      toast({
                        title: "Item deleted succesfully",
                        variant: "destructive",
                      });
                    }}
                  />
                ))}
            </TabsContent>

            <TabsContent value="placed-items">
              {/* FIXME later for improve performance */}
              {itemsQuery.data
                ?.filter((item) =>
                  placedItemsQuery.data
                    ?.map((karpuz) => karpuz.itemId)
                    .includes(item.id)
                )
                .map((item) => (
                  <ListedRoomItem
                    key={item.id}
                    item={item}
                    onClick={() =>
                      placeItemMutation.mutate({
                        roomId: roomQuery.data?.id,
                        itemId: item.id,
                        x: 100,
                        y: 100,
                        zIndex: 1,
                      })
                    }
                    onItemDeleted={async () => {
                      await deleteItemMutation.mutateAsync(item.id);
                      toast({
                        title: "Item deleted succesfully",
                        variant: "destructive",
                      });
                    }}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <FabricCanvas
        room={roomQuery.data}
        roomItems={placedItemsQuery.data ?? []}
        onItemSelected={(itemId: string) => setSelectedItemId(itemId)}
        onItemUpdated={({
          itemId,
          updatedItem,
          updatedPlacedItem,
        }: {
          itemId: string;
          updatedItem?: UpdatedRoomItem;
          updatedPlacedItem?: UpdatedPlacedItem;
        }) => {
          // FIXME: this should be combined into a single update
          if (updatedPlacedItem)
            updatePlacedItemMutation.mutate({
              roomId: roomQuery.data?.id,
              itemId,
              updatedPlacedItem,
            });

          if (updatedItem)
            updateItemMutation.mutate({
              itemId,
              updatedItem,
            });
        }}
        onItemDeleted={(itemId: string) =>
          deletePlacedItemMutation.mutateAsync({
            itemId: itemId,
            roomId: roomQuery.data.id,
          })
        }
      />

      <RightMenu
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
      />
    </div>
  );
}
