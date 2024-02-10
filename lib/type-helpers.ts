import { Database } from "@/supabase/database.types";

export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type NewRoom = Database["public"]["Tables"]["rooms"]["Insert"];
export type UpdatedRoom = Database["public"]["Tables"]["rooms"]["Update"];

export type RoomItem = Database["public"]["Tables"]["items"]["Row"];
export type NewRoomItem = Database["public"]["Tables"]["items"]["Insert"];
export type UpdatedRoomItem = Database["public"]["Tables"]["items"]["Update"];
