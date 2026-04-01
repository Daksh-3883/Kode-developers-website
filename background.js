// ===================== CANVAS SETUP =====================
const canvas = document.createElement("canvas");
canvas.id = "bg-canvas";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

// ===================== VARIABLES =====================
let width, height;
let hexSize;
let cols, rows;
let time = 0;

// Performance detection
const isMobile = window.innerWidth < 768;
const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

// Adaptive hex size
hexSize = isMobile ? 55 : isLowEnd ? 45 : 35;

// ===================== RESIZE HANDLER =====================
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  cols = Math.ceil(width / (hexSize * 1.5));
  rows = Math.ceil(height / (hexSize * 1.7));
}

window.addEventListener("resize", resize);
resize();

// ===================== DRAW HEX =====================
function drawHex(x, y, size, color, alpha) {
  ctx.beginPath();

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);

    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  ctx.closePath();
  ctx.strokeStyle = `rgba(${color}, ${alpha})`;
  ctx.lineWidth = 1.1;
  ctx.stroke();
}

// ===================== ANIMATION LOOP =====================
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Slower animation for smoother feel
  time += isLowEnd ? 0.004 : 0.008;

  // Edge width (where hexes appear)
  const edgeWidth = width * (isMobile ? 0.18 : 0.25);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {

      const x = i * hexSize * 1.5;
      const y = j * hexSize * 1.7 + (i % 2 ? hexSize * 0.85 : 0);

      const distLeft = x;
      const distRight = width - x;

      let alpha = 0;

      // Only draw on left/right sides
      if (distLeft < edgeWidth) {
        alpha = 1 - (distLeft / edgeWidth);
      } else if (distRight < edgeWidth) {
        alpha = 1 - (distRight / edgeWidth);
      }

      if (alpha <= 0) continue;

      // Smooth fade curve (premium feel)
      alpha = Math.pow(alpha, 1.5) * 0.85;

      // RGB flowing effect
      const r = Math.floor(120 + 135 * Math.sin(time + i * 0.25));
      const g = Math.floor(120 + 135 * Math.sin(time + j * 0.25));
      const b = Math.floor(120 + 135 * Math.sin(time));

      drawHex(x, y, hexSize, `${r},${g},${b}`, alpha);
    }
  }

  requestAnimationFrame(animate);
}

// ===================== START =====================
animate();
