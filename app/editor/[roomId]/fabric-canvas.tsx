import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

const FabricCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      height: 400,
      width: 400,
    });

    // Example: Add a circle to the canvas
    const circle = new fabric.Circle({
      radius: 20,
      fill: "lightgreen",
      left: 100,
      top: 100,
    });

    canvas.add(circle);
    canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;

      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

      opt.e.preventDefault();
      opt.e.stopPropagation();

      const vpt = this.viewportTransform;

      if (zoom < 400 / 1000) {
        vpt[4] = 200 - (1000 * zoom) / 2;
        vpt[5] = 200 - (1000 * zoom) / 2;
      } else {
        if (vpt[4] >= 0) {
          vpt[4] = 0;
        } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
          vpt[4] = canvas.getWidth() - 1000 * zoom;
        }

        if (vpt[5] >= 0) {
          vpt[5] = 0;
        } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
          vpt[5] = canvas.getHeight() - 1000 * zoom;
        }
      }
    });

    // Cleanup on component unmount
    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <div className="border w-fit">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FabricCanvas;
