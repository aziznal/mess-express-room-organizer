"use client";

import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

import { PlacedItem, Room, UpdatedPlacedItem } from "@/lib/type-helpers";
import { setupPanHandler, setupZoomHandler } from "@/lib/canvas/utils";
import debounce from "lodash.debounce";

type FabricCanvasProps = {
  room: Room;
  roomItems: PlacedItem[];
  onItemUpdated: ({
    itemId,
    item,
  }: {
    itemId: string;
    item: UpdatedPlacedItem;
  }) => void;
  onItemDeleted: (itemId: string) => void;
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

  // Main way items are added, removed, and updated
  useEffect(() => {
    if (!fabricCanvas) return;

    const existingItemIds = fabricCanvas.getObjects().map((obj) => {
      return obj.data?.id as string;
    });

    const itemsToAdd = props.roomItems.filter(
      (item) => !existingItemIds.includes(item.data.id)
    );

    itemsToAdd.forEach((item) => {
      const rect = new fabric.Rect({
        width: item.data.width,
        height: item.data.height,
        fill: item.data.backgroundColor,
        data: {
          id: item.data.id,
          // type: "rect",
        },
      });

      rect.set({
        left: item.x,
        top: item.y,
      });

      const text = new fabric.Text(item.data.name, {
        fontSize: 16,
        fill: "white",
        originX: "center",
        originY: "center",
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        selectable: false,
        data: {
          id: item.data.id,
          // type: "text",
        },
      });

      // add text to center of rect
      const rectCenterCoords = rect.getCenterPoint();

      text.set({
        left: rectCenterCoords.x,
        top: rectCenterCoords.y,
      });

      const updateItemLocation = debounce(() => {
        const updatedLeft = Math.round(rect.left ?? 0);
        const updatedTop = Math.round(rect.top ?? 0);

        props.onItemUpdated({
          itemId: item.data.id,
          item: {
            x: updatedLeft,
            y: updatedTop,
          },
        });
      }, 500);

      rect.on("moving", (e) => {
        text.set({
          left: rect.getCenterPoint().x,
          top: rect.getCenterPoint().y,
        });

        updateItemLocation();
      });

      rect.on("scaling", (e) => {
        text.set({
          left: rect.getCenterPoint().x,
          top: rect.getCenterPoint().y,
        });

        // send item update event
        // props.onItemUpdate({
        //   itemId: item.data.id,
        //   item: {
        //     width: rect.width,
        //     height: rect.height,
        //     x: rect.left,
        //     y: rect.top,
        //   },
        // });
      });

      fabricCanvas.add(rect);
      fabricCanvas.add(text);
    });

    const itemsToUpdate = props.roomItems.filter((item) =>
      existingItemIds.includes(item.data.id)
    );

    console.log("itemsToUpdate", itemsToUpdate);

    itemsToUpdate.forEach((item) => {
      const obj = fabricCanvas.getObjects().find((obj) => {
        return obj.data?.id === item.data.id;
      });

      if (!obj) return;

      obj.set("top", item.y);
      obj.set("left", item.x);
      obj.set("width", item.data.width);
      obj.set("width", item.data.height);
      obj.set("fill", item.data.backgroundColor);
    });

    fabricCanvas.requestRenderAll();
  }, [fabricCanvas, props, props.roomItems]);

  // Shortcut keys
  useEffect(() => {
    if (!window || !fabricCanvas) return;

    // detect delete clicks
    const deleteHandler = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        const activeObjects = fabricCanvas.getActiveObjects();

        activeObjects.forEach((obj) => {
          props.onItemDeleted(obj.data.id);
          fabricCanvas.remove(obj);
        });
      }
    };

    window.addEventListener("keydown", deleteHandler);

    () => {
      window.removeEventListener("keydown", deleteHandler);
    };
  }, [fabricCanvas, props]);

  return (
    <div className="flex items-center justify-center w-fit h-fit overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FabricCanvas;
