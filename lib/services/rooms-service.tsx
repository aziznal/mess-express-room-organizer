import { useQuery, useMutation } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { NewRoom, UpdatedRoom } from "../type-helpers";
import { queryClient } from "../tanstack-query-client";

const supabase = createClient();

export const roomKeys = {
  all: ["rooms"] as const,
  getRooms: () => [...roomKeys.all, "get-rooms"] as const,
  getRoomById: (roomId: string) => [...roomKeys.all, roomId] as const,
};

// Get rooms
export const useGetRoomsQuery = () =>
  useQuery({
    queryKey: roomKeys.getRooms(),
    queryFn: async () => {
      const { data, error } = await supabase.from("rooms").select("*");

      if (error) {
        console.log("error", error);
        throw error;
      }

      return data;
    },
  });

// Get room by id
export const useGetRoomByIdQuery = (roomId: string) =>
  useQuery({
    queryKey: roomKeys.getRoomById(roomId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (error) {
        console.log(error);
        throw error;
      }

      return data;
    },
  });

// Create room
export const useCreateRoomMutation = () =>
  useMutation({
    mutationFn: async (newRoom: NewRoom) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { error } = await supabase.from("rooms").insert(newRoom);

      if (error) {
        console.log(error);
        throw error;
      }

      queryClient.invalidateQueries({
        queryKey: roomKeys.getRooms(),
      });
    },
  });

// Update room
export const useUpdateRoomMutation = () =>
  useMutation({
    mutationFn: async ({
      id,
      updatedRoom,
    }: {
      id: string;
      updatedRoom: UpdatedRoom;
    }) => {
      const { error } = await supabase
        .from("rooms")
        .update(updatedRoom)
        .eq("id", id);

      if (error) {
        console.log(error);
        throw error;
      }

      queryClient.invalidateQueries({
        queryKey: roomKeys.all,
      });
    },
  });

// Delete room
export const useDeleteRoomMutation = () =>
  useMutation({
    mutationFn: async (roomId: string) => {
      const { error } = await supabase.from("rooms").delete().eq("id", roomId);

      if (error) {
        console.log(error);
        return;
      }

      queryClient.invalidateQueries({
        queryKey: roomKeys.all,
      });
    },
  });
