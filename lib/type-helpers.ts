import { Database } from "@/supabase/database.types";

export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type NewRoom = Database["public"]["Tables"]["rooms"]["Insert"];
export type UpdatedRoom = Database["public"]["Tables"]["rooms"]["Update"];
