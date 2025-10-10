// UI behavior: mobile menu, dark mode toggle, active nav highlight
document.addEventListener("DOMContentLoaded", () => {
  /* Mobile menu */
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  mobileBtn && mobileBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  /* Dark mode toggle: styled theme (persist in localStorage) */
  const darkToggle = document.getElementById("darkModeToggle");
  const body = document.body;

  const applyTheme = (isLight) => {
    if (isLight) {
      body.classList.add("light-mode");
      // swap icon (optional): switch to moon/sun icon visually
      // You can replace innerHTML with a sun icon here if desired
    } else {
      body.classList.remove("light-mode");
    }
  };

  // initialize from storage (default: dark styled theme)
  const stored = localStorage.getItem("kd_theme");
  applyTheme(stored === "light");

  darkToggle && darkToggle.addEventListener("click", () => {
    const nowLight = !body.classList.contains("light-mode");
    applyTheme(nowLight);
    localStorage.setItem("kd_theme", nowLight ? "light" : "dark");
  });

  /* Active nav link highlighting while scrolling */
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute("href")));

  const setActiveLink = () => {
    const scrollPos = window.scrollY + (window.innerHeight / 3);
    sections.forEach((sec, idx) => {
      if (!sec) return;
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const link = navLinks[idx];
      if (scrollPos >= top && scrollPos < bottom) {
        link.classList.add("text-teal-400");
      } else {
        link.classList.remove("text-teal-400");
      }
    });
  };

  window.addEventListener("scroll", throttle(setActiveLink, 150));
  setActiveLink();

  /* Close mobile menu on link click (mobile friendly) */
  document.querySelectorAll("#mobileMenu a").forEach(a => a.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  }));
});

/* Small throttle util */
function throttle(fn, wait) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* Success popup helper (if you ever want to show it via JS) */
function showSuccessPopup() {
  const popup = document.getElementById("successPopup");
  if (popup) {
    popup.classList.remove("hidden");
  }
}
function closePopup() {
  const popup = document.getElementById("successPopup");
  if (popup) popup.classList.add("hidden");
}

/* Note:
   - setRating & loadAverageRating are defined in the Firebase module (index.html).
   - We exposed them to window in that module so the inline onclicks work.
*/

/* Accessibility: enable keyboard rating via arrow keys (optional enhancement) */
document.addEventListener("keydown", (e) => {
  const ratingGroup = document.getElementById("rating");
  if (!ratingGroup) return;
  const focused = document.activeElement;
  if (ratingGroup.contains(focused)) {
    let idx = Array.from(ratingGroup.children).indexOf(focused);
    if (e.key === "ArrowRight") {
      idx = Math.min(ratingGroup.children.length - 1, idx + 1);
      ratingGroup.children[idx].focus();
    } else if (e.key === "ArrowLeft") {
      idx = Math.max(0, idx - 1);
      ratingGroup.children[idx].focus();
    } else if (e.key === "Enter" || e.key === " ") {
      focused.click();
    }
  }
});
