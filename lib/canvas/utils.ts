// @ts-nocheck
export const setupZoomHandler = (canvas: fabric.Canvas) => {
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
  });
};

export const setupPanHandler = (canvas: fabric.Canvas) => {
  let isSpaceDown = false;

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      isSpaceDown = true;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
      isSpaceDown = false;
    }
  });

  canvas.on("mouse:down", function (opt) {
    const evt = opt.e;

    if (isSpaceDown === true) {
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
};
