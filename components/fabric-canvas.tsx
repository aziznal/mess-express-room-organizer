"use client";

import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

import { Room } from "@/lib/type-helpers";
import { setupPanHandler, setupZoomHandler } from "@/lib/canvas/utils";

type FabricCanvasProps = {
  room: Room;
};

const FabricCanvas = (props: FabricCanvasProps) => {
  const canvasRef = useRef(null);

  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!window) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      height: window.innerHeight,
      width: window.innerWidth,
    });

    setFabricCanvas(canvas);
    setupZoomHandler(canvas);
    setupPanHandler(canvas);

    const roomRect = new fabric.Rect({
      width: props.room.width,
      height: props.room.height,

      left: canvas.width! / 2 - props.room.width / 2,
      top: canvas.height! / 2 - props.room.height / 2,

      strokeWidth: 2,
      fill: "transparent",
      stroke: "black",
      strokeUniform: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false,
      hasControls: false,
      hoverCursor: "default",
      strokeLineJoin: "round",
    });

    canvas.add(roomRect);

    // Cleanup on component unmount
    return () => {
      canvas.dispose();
    };
  }, [props.room]);

  return (
    <div className="flex items-center justify-center w-fit h-fit overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FabricCanvas;
