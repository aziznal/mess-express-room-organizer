import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../tanstack-query-client";
import { NewRoomItem, RoomItem, UpdatedRoomItem } from "../type-helpers";

const supabase = createClient();

export const itemKeys = {
  all: ["items"] as const,
  getItems: () => [...itemKeys.all, "get-items"] as const,
  getItemById: (itemId: string) => [...itemKeys.all, itemId] as const,
};

export const useGetItemsQuery = () =>
  useQuery({
    queryKey: itemKeys.getItems(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.log("error", error);
        throw error;
      }

      return data;
    },
  });

export const useGetItemByIdQuery = (itemId: string) => {
  useQuery({
    queryKey: itemKeys.getItemById(itemId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", itemId);

      if (error) {
        console.log("error", error);
        throw error;
      }

      return data;
    },
  });
};

export const useCreateItemMutation = () =>
  useMutation({
    mutationFn: async (newRoomItem: NewRoomItem) => {
      const { error } = await supabase.from("items").insert(newRoomItem);

      if (error) {
        console.log("error", error);
        throw error;
      }

      queryClient.invalidateQueries({
        queryKey: itemKeys.all,
      });
    },
  });

export const useUpdateItemMutation = () =>
  useMutation({
    mutationFn: async ({
      itemId,
      updatedItem,
    }: {
      itemId: string;
      updatedItem: UpdatedRoomItem;
    }) => {
      const { error } = await supabase
        .from("items")
        .update(updatedItem)
        .eq("id", itemId);

      if (error) {
        console.log("error", error);
        throw error;
      }

      queryClient.invalidateQueries({
        queryKey: itemKeys.all,
      });
    },
  });

export const useDeleteItemMutation = () =>
  useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from("items").delete().eq("id", itemId);

      if (error) {
        console.log("error", error);
        throw error;
      }

      queryClient.invalidateQueries({
        queryKey: itemKeys.all,
      });
    },
  });
