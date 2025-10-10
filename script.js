// Smooth scrolling for nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
mobileMenuBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// =========================
// Rating system
// =========================
const ratingMsg = document.getElementById('ratingMsg');
const ratingStars = document.querySelectorAll('#rating span');

async function setRating(stars) {
  // Highlight stars
  ratingStars.forEach((star, i) => {
    star.classList.toggle('text-yellow-400', i < stars);
    star.classList.toggle('text-gray-500', i >= stars);
  });

  ratingMsg.classList.remove('hidden');
  ratingMsg.textContent = `Thanks! You rated us ${stars}★`;

  try {
    // Call Netlify function to save rating
    const res = await fetch('/.netlify/functions/addRating', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stars })
    });
    const data = await res.json();
    if (data.success) {
      console.log('✅ Rating saved:', stars);
      loadAverageRating();
    } else {
      console.error('❌ Failed to save rating');
    }
  } catch (e) {
    console.error('❌ Error saving rating:', e);
  }
}

// Load average rating from Netlify function
async function loadAverageRating() {
  try {
    const res = await fetch('/.netlify/functions/addRating?mode=average');
    const data = await res.json();
    if (data.avg !== undefined) {
      if (!document.getElementById('avgRating')) {
        const p = document.createElement('p');
        p.id = 'avgRating';
        p.className = 'mt-2 text-teal-300 font-medium';
        ratingMsg.parentNode.insertBefore(p, ratingMsg);
      }
      document.getElementById('avgRating').textContent = `⭐ ${data.avg} / 5 (${data.count} reviews)`;
    }
  } catch (e) {
    console.error('❌ Error loading average rating:', e);
  }
}

// Initialize
loadAverageRating();
window.setRating = setRating;
