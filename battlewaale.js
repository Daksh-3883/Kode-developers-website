// --------------------- CURSOR FOLLOWER ---------------------
const cursor = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.width = cursor.style.height = '40px');
  el.addEventListener('mouseleave', () => cursor.style.width = cursor.style.height = '20px');
});

// --------------------- FADE-UP SECTIONS ---------------------
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

// --------------------- NAVBAR GLOW ON SCROLL ---------------------
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;
let isHidden = false;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if(currentScroll > 30){
    navbar.style.backgroundColor = 'rgba(17,24,39,0.85)';
    navbar.style.boxShadow = '0 0 30px rgba(79,209,197,0.25)';
    navbar.style.backdropFilter = 'blur(14px)';
  } else {
    navbar.style.backgroundColor = 'rgba(17,24,39,0.4)';
    navbar.style.boxShadow = '0 0 15px rgba(79,209,197,0.15)';
    navbar.style.backdropFilter = 'blur(20px)';
  }

  // Auto-hide on scroll down
  if(currentScroll > lastScrollY && currentScroll > 100 && !isHidden){
    navbar.style.transform = 'translate(-50%, -100%)';
    isHidden = true;
  } else if(currentScroll < lastScrollY && isHidden){
    navbar.style.transform = 'translate(-50%, 0)';
    isHidden = false;
  }

  lastScrollY = currentScroll;
});
