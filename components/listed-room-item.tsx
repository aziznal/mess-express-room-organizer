import { RoomItem } from "@/lib/type-helpers";
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
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useUpdateItemMutation } from "@/lib/services/items-service";
import { LucideMoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex justify-between hover:bg-slate-700 p-4 rounded-lg transition-colors cursor-grab group",
        isDropdownOpen && "bg-slate-700"
      )}
    >
      <div className="flex gap-2">
        <div
          className="w-[50px] h-[50px] rounded-lg border border-slate-400"
          style={{
            backgroundColor: item.backgroundColor,
          }}
        />

        <div className="flex flex-col justify-center gap-1 text-sm">
          <span>{item.name}</span>
          <span className="text-slate-500">
            {item.width}x{item.height}
          </span>
        </div>
      </div>

      <DropdownMenu
        open={isDropdownOpen}
        onOpenChange={(isOpen) => setIsDropdownOpen(isOpen)}
      >
        <DropdownMenuTrigger className="cursor-pointer">
          <LucideMoreHorizontal
            className={cn(
              "opacity-0 text-slate-500 group-hover:opacity-100 transition-opacity",
              isDropdownOpen && "opacity-100"
            )}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
  );
};
