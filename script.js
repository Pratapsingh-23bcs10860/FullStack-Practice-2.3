// Simple SVG freehand drawing with mouse/pointer events
(() => {
  const svg = document.getElementById("canvas");

  let drawing = false;
  let currentLine = null; // <polyline>
  let points = [];        // array of [x,y]

  // Convert page (client) coordinates to SVG coordinates
  function toSvgPoint(evt) {
    const rect = svg.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    return [x, y];
  }

  function startDraw(evt) {
    drawing = true;
    svg.setPointerCapture?.(evt.pointerId);

    points = [];
    const [x, y] = toSvgPoint(evt);
    points.push([x, y]);

    currentLine = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    currentLine.setAttribute("points", `${x},${y}`);
    svg.appendChild(currentLine);
  }

  function draw(evt) {
    if (!drawing || !currentLine) return;
    const [x, y] = toSvgPoint(evt);
    points.push([x, y]);

    // Update the polyline's points attribute
    const d = points.map(p => `${p[0]},${p[1]}`).join(" ");
    currentLine.setAttribute("points", d);
  }

  function endDraw(evt) {
    if (!drawing) return;
    drawing = false;
    svg.releasePointerCapture?.(evt.pointerId);

    // discard very short strokes (optional)
    if (points.length < 2 && currentLine) {
      currentLine.remove();
    }

    currentLine = null;
    points = [];
  }

  // Use Pointer Events for best cross-device support
  svg.addEventListener("pointerdown", startDraw);
  svg.addEventListener("pointermove", draw);
  svg.addEventListener("pointerup", endDraw);
  svg.addEventListener("pointerleave", endDraw);

  // Also prevent page drag image ghosting
  svg.addEventListener("dragstart", e => e.preventDefault());
})();
