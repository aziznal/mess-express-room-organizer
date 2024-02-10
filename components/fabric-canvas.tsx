// @ts-nocheck

"use client";

import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

import { Room } from "@/lib/type-helpers";

type FabricCanvasProps = {
  room: Room;
};

const FabricCanvas = (props: FabricCanvasProps) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!window) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      height: window.innerHeight,
      width: window.innerWidth,
    });

    canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();

      zoom *= 0.999 ** delta;

      const maxZoomIn = 20;
      const maxZoomOut = 0.001;

      if (zoom > maxZoomIn) zoom = maxZoomIn;
      if (zoom < maxZoomOut) zoom = maxZoomOut;

      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

      opt.e.preventDefault();
      opt.e.stopPropagation();

      const vpt = this.viewportTransform;

      // Supposed to prevent panning out of bounds but doesn't seem to work
      // if (zoom < 400 / 1000) {
      //   vpt[4] = 200 - (1000 * zoom) / 2;
      //   vpt[5] = 200 - (1000 * zoom) / 2;
      // } else {
      //   if (vpt[4] >= 0) {
      //     vpt[4] = 0;
      //   } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
      //     vpt[4] = canvas.getWidth() - 1000 * zoom;
      //   }
      //   if (vpt[5] >= 0) {
      //     vpt[5] = 0;
      //   } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
      //     vpt[5] = canvas.getHeight() - 1000 * zoom;
      //   }
      // }
    });

    canvas.on("mouse:down", function (opt) {
      const evt = opt.e;

      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });

    canvas.on("mouse:move", function (opt) {
      if (this.isDragging) {
        canvas.setCursor("grab");

        var e = opt.e;
        var vpt = this.viewportTransform;

        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;

        this.requestRenderAll();

        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });

    canvas.on("mouse:up", function (opt) {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
    });

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
