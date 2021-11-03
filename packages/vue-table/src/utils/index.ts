export const drawLine = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color?: string,
) => {
  if (color) {
    ctx.save();
    ctx.strokeStyle = color;
  }
  ctx.beginPath();
  ctx.moveTo(startX + 0.5, startY + 0.5);
  ctx.lineTo(endX + 0.5, endY + 0.5);
  ctx.closePath();
  ctx.stroke();

  if (color) {
    ctx.restore();
  }
};
