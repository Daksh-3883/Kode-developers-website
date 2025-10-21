// ===================== NAVBAR & MOBILE MENU =====================
const menuBtn = document.getElementById('menu-btn');
const bars = menuBtn.querySelectorAll('.bar');
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');

menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('flex');
  if(!isOpen){
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
      mobileMenu.classList.remove('scale-y-0','opacity-0');
      mobileMenu.classList.add('scale-y-100','opacity-100','flex');
    }, 10);
    bars[0].classList.add('rotate-45','translate-y-[8px]');
    bars[1].classList.add('opacity-0');
    bars[2].classList.add('-rotate-45','-translate-y-[8px]');
  } else {
    mobileMenu.classList.remove('scale-y-100','opacity-100');
    mobileMenu.classList.add('scale-y-0','opacity-0');
    setTimeout(() => { 
      mobileMenu.classList.remove('flex'); 
      mobileMenu.classList.add('hidden'); 
    }, 400);
    bars.forEach(bar => bar.classList.remove('rotate-45','-rotate-45','translate-y-[8px]','-translate-y-[8px]','opacity-0'));
  }
});

// ===================== NAVBAR SCROLL EFFECT =====================
let lastScrollY = window.scrollY; 
let isHidden = false;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  // Shrink & glow
  if(currentScroll > 30){
    navbar.classList.add('scale-95');
    navbar.style.backgroundColor='rgba(17,24,39,0.85)';
    navbar.style.boxShadow='0 0 30px rgba(79,209,197,0.25)';
    navbar.style.backdropFilter='blur(14px)';
    navbar.style.borderColor='rgba(94,234,212,0.3)';
  } else {
    navbar.classList.remove('scale-95');
    navbar.style.backgroundColor='rgba(17,24,39,0.4)';
    navbar.style.boxShadow='0 0 15px rgba(79,209,197,0.15)';
    navbar.style.backdropFilter='blur(20px)';
    navbar.style.borderColor='rgba(75,85,99,0.3)';
  }

  // Auto-hide on scroll down
  if(currentScroll > lastScrollY && currentScroll > 100 && !isHidden){
    navbar.style.transform='translate(-50%,-100%)';
    isHidden = true;
  } else if(currentScroll < lastScrollY && isHidden){
    navbar.style.transform='translate(-50%,0)';
    isHidden = false;
  }

  lastScrollY = currentScroll;
});

// ===================== FADE-UP SECTION REVEAL =====================
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.1});
fadeEls.forEach(el => observer.observe(el));

// ===================== CURSOR FOLLOWER =====================
const cursor = document.getElementById('cursorGlow');

document.addEventListener('mousemove', e => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});

// Cursor enlarge on hover
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', ()=> cursor.style.width = cursor.style.height = '40px');
  el.addEventListener('mouseleave', ()=> cursor.style.width = cursor.style.height = '20px');
});

// ===================== HERO PARALLAX (OPTIONAL) =====================
const heroTitle = document.querySelector('#home h1');
if(heroTitle){
  document.addEventListener('mousemove', e => {
    const moveX = (e.clientX - window.innerWidth/2) * 0.02;
    const moveY = (e.clientY - window.innerHeight/2) * 0.02;
    heroTitle.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
}
