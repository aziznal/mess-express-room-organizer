"use client";

import RoomGridItem from "@/components/room";
import { Button } from "@/components/ui/button";
import { Room } from "@/lib/type-helpers";
import { createClient } from "@/utils/supabase/client";
import { LucidePlus } from "lucide-react";
import { useEffect, useState } from "react";

export default function RoomPage() {
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
    <div className="flex flex-col p-4 items-start">
      <div className="text-2xl font-bold mt-16">Welcome to MessExpress™</div>

      <Button className="mt-6">
        New Room <LucidePlus />
      </Button>

      {/*  Room Grid */}
      <div className="mt-12 w-full flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-0">
        {rooms.map((room) => (
          <RoomGridItem key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
