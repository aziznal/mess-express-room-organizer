import { RoomItem } from "@/lib/type-helpers";
import { Button } from "./ui/button";
import { LucidePen } from "lucide-react";
import { UpdateItem } from "./update-item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useUpdateItemMutation } from "@/lib/services/items-service";

type ListedRoomItemProps = {
  item: RoomItem;
  onItemDeleted: () => void;
};

export const ListedRoomItem = ({
  item,
  onItemDeleted,
}: ListedRoomItemProps) => {
  const updateRoomItemMutation = useUpdateItemMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  return (
    <div className="flex flex-row justify-around items-center border-b pb-4 ">
      <div className="w-4/5 h-fit flex justify-between items-center">
        <div>
          <span className="mr-4">{item.name}</span>
          <span style={{ color: item.backgroundColor }}></span>
          {item.backgroundColor}
        </div>

        <div className="flex flex-col gap-2 text-xs items-end">
          <span>width: {item.width}</span>
          <span>height: {item.height}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <UpdateItem
          item={item}
          isLoading={updateRoomItemMutation.isPending}
          setIsUpdateDialogOpen={setIsUpdateDialogOpen}
          isUpdateDialogOpen={isUpdateDialogOpen}
          onItemUpdated={async (updatedItem) => {
            await updateRoomItemMutation.mutateAsync({
              itemId: item.id,
              updatedItem,
            });
          }}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger className="hover:text-slate-400">
            X
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                item.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                onClick={() => onItemDeleted()}
                className="bg-red-500 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
