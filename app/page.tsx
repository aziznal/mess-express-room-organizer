"use client";

import { Database } from "@/supabase/database.types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from("rooms").select("*");

      if (error) {
        console.log("error", error);
        return;
      }

      setRooms(data);
    };

    fetchRooms();
  }, [supabase]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex flex-col gap-2">
        {rooms.map((room) => (
          <div key={room.id} className="flex gap-2">
            <span>{room.name}</span>
            <span className="flex gap-1">
              <span>{room.width}</span>-<span>{room.height}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
