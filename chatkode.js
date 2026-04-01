// ===================== 1. THEME TOGGLE ENGINE =====================
const themeToggleBtn = document.getElementById('theme-toggle');

// Helper to update the button icon based on current theme
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = '☀️'; // Sun for dark mode
  } else {
    document.body.classList.remove('dark-theme');
    themeToggleBtn.textContent = '🌙'; // Moon for light mode
  }
}

// Check local storage for saved theme preference (default to light)
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// Listen for clicks on the toggle button
themeToggleBtn.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
});


// ===================== 2. CURSOR FOLLOWER =====================
const cursor = document.getElementById('cursorGlow');

// Move cursor with mouse
document.addEventListener('mousemove', e => {
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';
});

// Expand cursor when hovering over links or buttons
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '40px';
    cursor.style.height = '40px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
  });
});


// ===================== 3. FADE-UP ON SCROLL =====================
const fadeEls = document.querySelectorAll('.fade-up');

// Intersection Observer to trigger animations when elements enter viewport
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target); // Stop observing once shown
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));


// ===================== 4. NAVBAR & MOBILE MENU =====================
const menuBtn = document.getElementById('menu-btn');
const bars = menuBtn.querySelectorAll('.bar');
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');

// Toggle Mobile Menu
menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('flex');

  if (!isOpen) {
    // Open Menu
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
      mobileMenu.classList.remove('scale-y-0','opacity-0');
      mobileMenu.classList.add('scale-y-100','opacity-100','flex');
    }, 10);

    // Animate Hamburger to 'X'
    bars[0].classList.add('rotate-45','translate-y-[6px]');
    bars[1].classList.add('opacity-0');
    bars[2].classList.add('-rotate-45','-translate-y-[6px]');
  } else {
    // Close Menu
    mobileMenu.classList.remove('scale-y-100','opacity-100');
    mobileMenu.classList.add('scale-y-0','opacity-0');
    setTimeout(() => {
      mobileMenu.classList.remove('flex');
      mobileMenu.classList.add('hidden');
    }, 400);

    // Revert 'X' back to Hamburger
    bars.forEach(bar => bar.classList.remove('rotate-45','-rotate-45','translate-y-[6px]','-translate-y-[6px]','opacity-0'));
  }
});

// Navbar Shrink/Glow Effect on Scroll
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if(currentScroll > 30){
    navbar.classList.add('scale-95'); // Shrinks slightly
    navbar.style.boxShadow = '0 0 30px rgba(79, 209, 197, 0.25)'; // Adds teal glow
  } else {
    navbar.classList.remove('scale-95'); // Returns to normal size
    navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'; // Standard subtle shadow
  }
});


// ===================== 5. FLOWING RGB HEXAGON ENGINE =====================
const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let width, height;
const hexSize = 35; // Size of hexagons
const colors = ['#ff4d4d', '#00f2ff', '#ff944d', '#ffe600', '#bc00ff', '#0070ff']; // Red, Cyan, Orange, Yellow, Purple, Blue

function initCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

// Math helper to smoothly blend between your RGB colors
function interpolateColor(color1, color2, factor) {
  const hex = (c) => parseInt(c.slice(1), 16);
  const r1 = (hex(color1) >> 16) & 0xff, g1 = (hex(color1) >> 8) & 0xff, b1 = hex(color1) & 0xff;
  const r2 = (hex(color2) >> 16) & 0xff, g2 = (hex(color2) >> 8) & 0xff, b2 = hex(color2) & 0xff;
  
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  return `rgb(${r}, ${g}, ${b})`;
}

// Calculates the "waterfall" color effect based on vertical position
function getFlowColor(y, time) {
  const flowSpeed = 0.08; 
  const flowLength = height * 1.5; 
  
  const phase = (y + time * flowSpeed) % flowLength;
  const ratio = phase / flowLength;
  const scaled = ratio * colors.length;
  
  const index = Math.floor(scaled);
  const nextIndex = (index + 1) % colors.length;
  const factor = scaled - index;
  
  return interpolateColor(colors[index], nextIndex === colors.length ? colors[0] : colors[nextIndex], factor);
}

// Draws a single hexagon
function drawHexagon(x, y, size, time, globalAlpha) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  ctx.strokeStyle = getFlowColor(y, time);
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = globalAlpha;
  ctx.stroke();
}

// Main animation loop
function animateBackground(time) {
  ctx.clearRect(0, 0, width, height);
  
  const hexWidth = hexSize * 1.5;
  const hexHeight = hexSize * Math.sqrt(3);
  const columns = Math.ceil(width / hexWidth) + 1;
  const rows = Math.ceil(height / hexHeight) + 1;

  for (let c = 0; c < columns; c++) {
    // Only draw on the extreme left (25%) and right (25%) of the screen
    const leftWingBoundary = columns * 0.25; 
    const rightWingBoundary = columns * 0.75; 
    
    let alpha = 0;
    
    // Calculate fade gradient towards the center
    if (c < leftWingBoundary) {
      alpha = 1 - (c / leftWingBoundary);
    } else if (c > rightWingBoundary) {
      alpha = (c - rightWingBoundary) / (columns - rightWingBoundary);
    } else {
      continue; // Skip center columns to leave text readable
    }

    alpha *= 0.6; // Base transparency limit

    for (let r = 0; r < rows; r++) {
      const x = c * hexWidth;
      const y = r * hexHeight + (c % 2 === 0 ? 0 : hexHeight / 2);
      
      drawHexagon(x, y, hexSize, time, alpha);
    }
  }
  requestAnimationFrame(animateBackground);
}

// Initialize and start background
window.addEventListener('resize', initCanvas);
initCanvas();
requestAnimationFrame(animateBackground);
