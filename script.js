// ===================== IMPROVED THEME TOGGLE =====================
const themeToggleBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = '☀️';
    // Force specific tweaks for Tailwind classes that might be stubborn
    document.querySelectorAll('.glass-card').forEach(card => card.style.backgroundColor = 'rgba(30, 41, 59, 0.6)');
  } else {
    document.body.classList.remove('dark-theme');
    themeToggleBtn.textContent = '🌙';
    document.querySelectorAll('.glass-card').forEach(card => card.style.backgroundColor = 'rgba(255, 255, 255, 0.7)');
  }
}

// Load saved preference
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
});

// ===================== NAVBAR & MOBILE MENU =====================
const menuBtn = document.getElementById('menu-btn');
const bars = menuBtn.querySelectorAll('.bar');
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');

menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('flex');

  if (!isOpen) {
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
      mobileMenu.classList.remove('scale-y-0','opacity-0');
      mobileMenu.classList.add('scale-y-100','opacity-100','flex');
    }, 10);
    bars[0].classList.add('rotate-45','translate-y-[6px]');
    bars[1].classList.add('opacity-0');
    bars[2].classList.add('-rotate-45','-translate-y-[6px]');
  } else {
    mobileMenu.classList.remove('scale-y-100','opacity-100');
    mobileMenu.classList.add('scale-y-0','opacity-0');
    setTimeout(() => {
      mobileMenu.classList.remove('flex');
      mobileMenu.classList.add('hidden');
    }, 400);
    bars.forEach(bar => bar.classList.remove('rotate-45','-rotate-45','translate-y-[6px]','-translate-y-[6px]','opacity-0'));
  }
});

// Navbar Scroll Effects
let lastScrollY = window.scrollY;
let isHidden = false;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if(currentScroll > 30){
    navbar.classList.add('scale-95');
    navbar.style.boxShadow = '0 0 30px rgba(79, 209, 197, 0.25)';
    navbar.style.backdropFilter = 'blur(14px)';
  } else {
    navbar.classList.remove('scale-95');
    navbar.style.boxShadow = '0 0 15px rgba(79, 209, 197, 0.15)';
    navbar.style.backdropFilter = 'blur(20px)';
  }

  if(currentScroll > lastScrollY && currentScroll > 100 && !isHidden){
    navbar.style.transform = 'translate(-50%, -100%)';
    isHidden = true;
  } else if(currentScroll < lastScrollY && isHidden){
    navbar.style.transform = 'translate(-50%, 0)';
    isHidden = false;
  }
  lastScrollY = currentScroll;
});

// ===================== FADE-UP & CURSOR =====================
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));

const cursor = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.width = cursor.style.height = '40px');
  el.addEventListener('mouseleave', () => cursor.style.width = cursor.style.height = '20px');
});

// ===================== HERO PARALLAX =====================
const heroTitle = document.querySelector('#home h1');
document.addEventListener('mousemove', e => {
  const moveX = (e.clientX - window.innerWidth/2) * 0.02;
  const moveY = (e.clientY - window.innerHeight/2) * 0.02;
  if(heroTitle) heroTitle.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

// ===================== RATING SYSTEM =====================
const ratingMsg = document.getElementById('ratingMsg');
const ratingStars = document.querySelectorAll('#rating span');

async function setRating(stars){
  ratingStars.forEach((star,i) => {
    star.classList.toggle('text-yellow-400', i<stars);
    star.classList.toggle('text-gray-500', i>=stars);
    star.classList.add('animate-bounce');
    setTimeout(()=> star.classList.remove('animate-bounce'),500);
  });
  ratingMsg.classList.remove('hidden');
  ratingMsg.textContent = `Thanks! You rated us ${stars}★`;

  try {
    const res = await fetch('/.netlify/functions/addRating',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({stars})
    });
    const data = await res.json();
    if(data.success) loadAverageRating();
  } catch(e){
    console.error('Error saving rating:', e);
  }
}

async function loadAverageRating(){
  try {
    const res = await fetch('/.netlify/functions/addRating?mode=average');
    const data = await res.json();
    if(data.avg !== undefined){
      if(!document.getElementById('avgRating')){
        const p = document.createElement('p');
        p.id = 'avgRating';
        p.className = 'mt-2 text-teal-300 font-medium';
        ratingMsg.parentNode.insertBefore(p, ratingMsg);
      }
      document.getElementById('avgRating').textContent = `⭐ ${data.avg} / 5 (${data.count} reviews)`;
    }
  } catch(e){
    console.error('Error loading average rating:', e);
  }
}
window.setRating = setRating;
loadAverageRating();

// ===================== FLOWING RGB HEXAGON ENGINE =====================
const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let width, height;
const hexSize = 35; // Size of hexagons
const colors = ['#ff4d4d', '#00f2ff', '#ff944d', '#ffe600', '#bc00ff', '#0070ff'];

function initCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function interpolateColor(color1, color2, factor) {
  const hex = (c) => parseInt(c.slice(1), 16);
  const r1 = (hex(color1) >> 16) & 0xff, g1 = (hex(color1) >> 8) & 0xff, b1 = hex(color1) & 0xff;
  const r2 = (hex(color2) >> 16) & 0xff, g2 = (hex(color2) >> 8) & 0xff, b2 = hex(color2) & 0xff;
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  return `rgb(${r}, ${g}, ${b})`;
}

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

function animateBackground(time) {
  ctx.clearRect(0, 0, width, height);
  
  const hexWidth = hexSize * 1.5;
  const hexHeight = hexSize * Math.sqrt(3);
  const columns = Math.ceil(width / hexWidth) + 1;
  const rows = Math.ceil(height / hexHeight) + 1;

  for (let c = 0; c < columns; c++) {
    const leftWingBoundary = columns * 0.25; 
    const rightWingBoundary = columns * 0.75; 
    let alpha = 0;
    
    if (c < leftWingBoundary) {
      alpha = 1 - (c / leftWingBoundary);
    } else if (c > rightWingBoundary) {
      alpha = (c - rightWingBoundary) / (columns - rightWingBoundary);
    } else {
      continue; 
    }

    alpha *= 0.6; // Base transparency

    for (let r = 0; r < rows; r++) {
      const x = c * hexWidth;
      const y = r * hexHeight + (c % 2 === 0 ? 0 : hexHeight / 2);
      drawHexagon(x, y, hexSize, time, alpha);
    }
  }
  requestAnimationFrame(animateBackground);
}

window.addEventListener('resize', initCanvas);
initCanvas();
requestAnimationFrame(animateBackground);
