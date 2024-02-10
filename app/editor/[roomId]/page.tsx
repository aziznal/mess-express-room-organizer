"use client";

import { LucideArrowLeft, LucideLoader2, LucidePlus } from "lucide-react";
import { useGetRoomByIdQuery } from "@/lib/services/rooms-service";
import FabricCanvas from "@/components/fabric-canvas";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <LucideLoader2 className="animate-spin" /> Error:
        {roomQuery.error.message}
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] flex items-center justify-center flex-col overflow-hidden">
      <div className="bg-slate-900 shadow h-full w-[400px] absolute top-0 left-0 z-50 text-white p-4 flex flex-col gap-4">
        <Link href="/rooms" className="flex gap-1 opacity-50 hover:opacity-100 text-xs items-center">
          <LucideArrowLeft size="20"/>
          Back to dashboard
        </Link>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl">Room Items</h2>

          <Button variant="secondary" className="text-xs">
            New Item
            <LucidePlus size="20" />
          </Button>
        </div>

        <hr className="border-slate-400" />
      </div>

      <FabricCanvas room={roomQuery.data} />
    </div>
  );
}
