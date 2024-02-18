import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../tanstack-query-client";
import {
  NewPlacedItem,
  NewRoomItem,
  PlacedItem,
  UpdatedPlacedItem,
  UpdatedRoomItem,
} from "../type-helpers";

const supabase = createClient();

export const itemKeys = {
  all: ["items"] as const,
  getItems: () => [...itemKeys.all, "get-items"] as const,
  getItemById: (itemId: string) => [...itemKeys.all, itemId] as const,
  getPlacedItemsByRoomId: (roomId: string) =>
    [...itemKeys.all, "placed-items", roomId] as const,
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

export const useGetItemByIdQuery = (itemId: string) =>
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

export const useGetPlacedItemsByRoomId = (roomId?: string) =>
  useQuery({
    enabled: !!roomId,
    queryKey: itemKeys.getPlacedItemsByRoomId(roomId!),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("itemsToRooms")
        .select(`*, data: items(*)`)
        .eq("roomId", roomId!);

      if (error) {
        console.log("error", error);
        throw error;
      }

      return data as PlacedItem[];
    },
  });

export const useCreateItemMutation = () =>
  useMutation({
    mutationFn: async (newRoomItem: NewRoomItem) => {
      const { data, error } = await supabase
        .from("items")
        .insert(newRoomItem)
        .select()
        .single();

      if (error) {
        console.log("error", error);
        throw error;
      }

      queryClient.invalidateQueries({
        queryKey: itemKeys.all,
      });

      return data;
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

export const useDeletePlacedItemMutation = () =>
  useMutation({
    mutationFn: async ({
      roomId,
      itemId,
    }: {
      roomId: string;
      itemId: string;
    }) => {
      const { error } = await supabase
        .from("itemsToRooms")
        .delete()
        .eq("itemId", itemId)
        .eq("roomId", roomId);

      if (error) {
        console.log("error", error);
        throw error;
      }

      queryClient.invalidateQueries({
        queryKey: itemKeys.getPlacedItemsByRoomId(roomId),
      });
    },
  });

export const usePlaceItemToRoomMutation = () =>
  useMutation({
    mutationFn: async (newPlacedItem: NewPlacedItem) => {
      const { error } = await supabase
        .from("itemsToRooms")
        .insert(newPlacedItem);

      if (error) {
        console.log("error", error);
        throw error;
      }

      queryClient.invalidateQueries({
        queryKey: itemKeys.all,
      });
    },
  });

export const useUpdatePlacedItemMutation = () =>
  useMutation({
    mutationFn: async ({
      itemId,
      roomId,
      updatedPlacedItem,
    }: {
      itemId: string;
      roomId: string;
      updatedPlacedItem: UpdatedPlacedItem;
    }) => {
      const { error } = await supabase
        .from("itemsToRooms")
        .update(updatedPlacedItem)
        .eq("itemId", itemId)
        .eq("roomId", roomId);

      if (error) {
        console.log("error", error);
        throw error;
      }

      queryClient.invalidateQueries({
        queryKey: itemKeys.all,
      });
    },
  });
