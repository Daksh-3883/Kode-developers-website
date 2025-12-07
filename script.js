// Navbar & Mobile Menu
const menuBtn = document.getElementById('menu-btn');
const bars = menuBtn.querySelectorAll('.bar');
const mobileMenu = document.getElementById('mobile-menu');

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

// --------------------- SCROLL EFFECTS ---------------------
let lastScrollY = window.scrollY;
let isHidden = false;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  // Navbar shrink & glow
  if(currentScroll > 30){
    navbar.classList.add('scale-95');
    navbar.style.backgroundColor = 'rgba(17, 24, 39, 0.85)';
    navbar.style.boxShadow = '0 0 30px rgba(79, 209, 197, 0.25)';
    navbar.style.backdropFilter = 'blur(14px)';
    navbar.style.borderColor = 'rgba(94, 234, 212, 0.3)';
  } else {
    navbar.classList.remove('scale-95');
    navbar.style.backgroundColor = 'rgba(17, 24, 39, 0.4)';
    navbar.style.boxShadow = '0 0 15px rgba(79, 209, 197, 0.15)';
    navbar.style.backdropFilter = 'blur(20px)';
    navbar.style.borderColor = 'rgba(75, 85, 99, 0.3)';
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

// --------------------- FADE-UP SECTION REVEAL ---------------------
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

// --------------------- CURSOR FOLLOWER ---------------------
const cursor = document.getElementById('cursorGlow');

document.addEventListener('mousemove', e => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});

// Cursor enlarge on hover
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.width = cursor.style.height = '40px');
  el.addEventListener('mouseleave', () => cursor.style.width = cursor.style.height = '20px');
});

// --------------------- HERO PARALLAX ---------------------
const heroTitle = document.querySelector('#home h1');

document.addEventListener('mousemove', e => {
  const moveX = (e.clientX - window.innerWidth/2) * 0.02;
  const moveY = (e.clientY - window.innerHeight/2) * 0.02;
  if(heroTitle) heroTitle.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

// --------------------- RATING SYSTEM ---------------------
const ratingMsg = document.getElementById('ratingMsg');
const ratingStars = document.querySelectorAll('#rating span');

async function setRating(stars){
  // Highlight stars with bounce
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

// Expose function globally
window.setRating = setRating;

// Initialize average rating
loadAverageRating();
