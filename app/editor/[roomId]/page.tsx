"use client";

import FabricCanvas from "./fabric-canvas";

type EditorProps = {
  params: {
    roomId: string;
  };
};

export default function Editor(props: EditorProps) {
  return (
    <div>
      <h1>Editor (room {props.params.roomId})</h1>

      <FabricCanvas />
    </div>
  );
}
