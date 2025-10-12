const menuBtn = document.getElementById('menu-btn');
const bars = menuBtn.querySelectorAll('.bar');
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');

// Mobile menu toggle
menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('flex');

  if (!isOpen) {
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
      mobileMenu.classList.remove('scale-y-0', 'opacity-0');
      mobileMenu.classList.add('scale-y-100', 'opacity-100', 'flex');
    }, 10);
    bars[0].classList.add('rotate-45', 'translate-y-[8px]');
    bars[1].classList.add('opacity-0');
    bars[2].classList.add('-rotate-45', '-translate-y-[8px]');
  } else {
    mobileMenu.classList.remove('scale-y-100', 'opacity-100');
    mobileMenu.classList.add('scale-y-0', 'opacity-0');
    setTimeout(() => {
      mobileMenu.classList.remove('flex');
      mobileMenu.classList.add('hidden');
    }, 400);
    bars.forEach(bar => bar.classList.remove('rotate-45','-rotate-45','translate-y-[8px]','-translate-y-[8px]','opacity-0'));
  }
});

// Scroll effects + auto-hide
let lastScrollY = window.scrollY;
let isHidden = false;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > 30) {
    navbar.classList.add('scale-95');
    navbar.style.backgroundColor = 'rgba(17, 24, 39, 0.85)';
    navbar.style.boxShadow = '0 0 30px rgba(79, 209, 197, 0.25)';
    navbar.style.backdropFilter = 'blur(14px)';
  } else {
    navbar.classList.remove('scale-95');
    navbar.style.backgroundColor = 'rgba(17, 24, 39, 0.4)';
    navbar.style.boxShadow = '0 0 15px rgba(79, 209, 197, 0.15)';
    navbar.style.backdropFilter = 'blur(20px)';
  }

  if (currentScroll > lastScrollY && currentScroll > 100 && !isHidden) {
    navbar.style.transform = 'translate(-50%, -100%)';
    isHidden = true;
  } else if (currentScroll < lastScrollY && isHidden) {
    navbar.style.transform = 'translate(-50%, 0)';
    isHidden = false;
  }
  lastScrollY = currentScroll;
});
