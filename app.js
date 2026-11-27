// ============================================================
// Portfolio interactions
// Everything that reacts to scrolling uses IntersectionObserver or a single
// requestAnimationFrame-throttled passive listener, so scrolling stays smooth.
// ============================================================

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navContainer = document.querySelector(".nav-container");

// ---------- Mobile menu ----------
function closeMenu() {
  hamburger.classList.remove("active");
  navLinks.classList.remove("active");
  hamburger.setAttribute("aria-expanded", "false");
}

hamburger.addEventListener("click", () => {
  const open = !navLinks.classList.contains("active");
  hamburger.classList.toggle("active", open);
  navLinks.classList.toggle("active", open);
  hamburger.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// ---------- Download CV ----------
const RESUME_URL =
  "https://drive.google.com/uc?export=download&id=1-EJqyHu9bPwu_HGftUBw69JN111FZynq";

document.querySelectorAll(".cv-download").forEach((button) => {
  button.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = RESUME_URL;
    a.setAttribute("download", "Rahul_Kumar_Sahu.pdf");
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
});

// ---------- Contact form (sends in place, no page redirect) ----------
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Sending...";
    formStatus.className = "form-status";
    formStatus.textContent = "";

    try {
      const res = await fetch(contactForm.dataset.ajaxAction, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === "false") throw new Error(data.message || "Request failed");

      const name = contactForm.querySelector("#name").value.trim();
      formStatus.classList.add("success");
      formStatus.textContent = `Thank you${name ? ", " + name : ""}! Your message has been sent. I'll get back to you soon.`;
      contactForm.reset();
    } catch (err) {
      formStatus.classList.add("error");
      formStatus.innerHTML =
        'Sorry, the message could not be sent. Please email me directly at <a href="mailto:rahulsahudev24@gmail.com">rahulsahudev24@gmail.com</a>.';
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
}

// ---------- Typing text ----------
const typingTextSpan = document.querySelector(".typing-text");
if (typingTextSpan) {
  const textArray = ["Flutter Developer", "Android App Publisher", "Full-Stack Developer"];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    typingTextSpan.textContent = textArray[0];
  } else {
    typingTextSpan.textContent = "";
    const type = () => {
      const currentText = textArray[textIndex];
      charIndex += isDeleting ? -1 : 1;
      typingTextSpan.textContent = currentText.substring(0, charIndex);

      let delay = isDeleting ? 60 : 120;
      if (!isDeleting && charIndex === currentText.length) {
        delay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        delay = 400;
      }
      setTimeout(type, delay);
    };
    type();
  }
}

// ---------- 3D tilt on the profile photo (mouse devices only, rAF-throttled) ----------
const profileContainer = document.querySelector(".hero .profile");
const profileImg = document.querySelector(".hero .profile img");

if (profileContainer && profileImg && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let tiltFrame = null;
  profileContainer.addEventListener("mousemove", (e) => {
    if (tiltFrame) return;
    tiltFrame = requestAnimationFrame(() => {
      tiltFrame = null;
      const rect = profileContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      profileImg.style.transform = `rotateX(${(y * 20).toFixed(2)}deg) rotateY(${(-x * 20).toFixed(2)}deg) scale(1.04)`;
    });
  });
  profileContainer.addEventListener("mouseleave", () => {
    profileImg.style.transform = "";
  });
}

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => revealObserver.observe(el));

// ---------- Highlight the nav link of the section in view ----------
const navAnchors = new Map();
document.querySelectorAll('.nav-links a[href^="#"]').forEach((a) => {
  navAnchors.set(a.getAttribute("href").slice(1), a);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const link = navAnchors.get(entry.target.id);
      if (!link) return;
      navAnchors.forEach((a) => a.classList.remove("active-link"));
      link.classList.add("active-link");
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
navAnchors.forEach((_, id) => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});

// ---------- Header shadow + back-to-top (one passive, rAF-throttled listener) ----------
const backToTop = document.querySelector(".back-to-top");
let scrollTicking = false;

function onScroll() {
  const y = window.scrollY;
  navContainer.classList.toggle("scrolled", y > 20);
  if (backToTop) backToTop.classList.toggle("show", y > 700);
  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true }
);
onScroll();

if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ---------- Footer year ----------
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
