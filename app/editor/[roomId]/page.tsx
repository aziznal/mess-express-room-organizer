"use client";

import { LucideLoader2 } from "lucide-react";
import { useGetRoomByIdQuery } from "@/lib/services/rooms-service";
import FabricCanvas from "@/components/fabric-canvas";

type EditorProps = {
  params: {
    roomId: string;
  };
};

export const dynamic = "force-dynamic";

export default function Editor(props: EditorProps) {
  const roomQuery = useGetRoomByIdQuery(props.params.roomId);

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
        <LucideLoader2 className="animate-spin" /> Error:{" "}
        {roomQuery.error.message}
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] flex items-center justify-center flex-col">
      <h1>Editor (room {props.params.roomId})</h1>

      <FabricCanvas room={roomQuery.data} />
    </div>
  );
}
