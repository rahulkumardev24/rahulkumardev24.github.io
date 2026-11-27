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
  const textArray = ["Flutter Developer", "Android & iOS Developer", "Play Store Publisher"];
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

// ---------- 3D tilt on the hero phone (mouse devices only, rAF-throttled) ----------
const phoneScene = document.querySelector(".phone-scene");
const phone = document.querySelector(".phone");

if (phoneScene && phone && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let tiltFrame = null;
  phoneScene.addEventListener("mousemove", (e) => {
    if (tiltFrame || phone.classList.contains("in-use")) return;
    tiltFrame = requestAnimationFrame(() => {
      tiltFrame = null;
      const rect = phoneScene.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      phone.style.transform = `rotateY(${(-18 + x * 22).toFixed(2)}deg) rotateX(${(7 - y * 14).toFixed(2)}deg) rotateZ(1.5deg)`;
    });
  });
  phoneScene.addEventListener("mouseleave", () => {
    phone.style.transform = "";
  });
}

// ---------- Interactive phone: tap an icon to open the app inside the phone ----------
const appsDataEl = document.getElementById("apps-data");
const phoneScreen = document.querySelector(".phone-screen");
const appView = document.querySelector(".ps-app");
const phoneFloat = document.querySelector(".phone-float");

if (appsDataEl && phoneScreen && appView) {
  const APPS = JSON.parse(appsDataEl.textContent);
  const playUrl = (id) => `https://play.google.com/store/apps/details?id=com.appcreatorrahul.${id}`;
  const esc = (t) => String(t).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  let lastIcon = null;

  const setInUse = (on) => {
    phone.classList.toggle("in-use", on);
    phoneFloat.classList.toggle("paused", on);
    phoneScreen.closest(".hero-visual").classList.toggle("phone-active", on);
    if (on) phone.style.transform = "";
  };

  const openApp = (id, icon) => {
    const app = APPS[id];
    if (!app) return;
    lastIcon = icon || null;

    const shots = Array.from({ length: app.shots }, (_, i) =>
      `<img src="images/shots/${id}-${i}.webp" alt="${esc(app.name)} screenshot ${i + 1}" loading="lazy" decoding="async" />`
    ).join("");

    appView.innerHTML = `
      <div class="psa-bar">
        <button type="button" class="psa-back" aria-label="Back to home screen"><i class="fas fa-arrow-left"></i></button>
        <img src="images/icons/play-${id}.webp" alt="" />
        <div><strong>${esc(app.name)}</strong><span>${esc(app.category)}</span></div>
      </div>
      <div class="psa-shots" tabindex="0" aria-label="Screenshots, swipe to see more">${shots}</div>
      <div class="psa-meta"><span><i class="fas fa-download"></i> ${esc(app.downloads)}</span><span>Free</span><span>Android</span></div>
      <p class="psa-desc">${esc(app.description)}</p>
      <div class="psa-actions">
        <a class="psa-install" href="${playUrl(id)}" target="_blank" rel="noopener"><i class="fab fa-google-play"></i> Install</a>
        ${app.live ? '<button type="button" class="psa-live"><i class="fas fa-play"></i> Open live app</button>' : ""}
      </div>`;

    appView.querySelector(".psa-back").addEventListener("click", closeApp);
    enableDragScroll(appView.querySelector(".psa-shots"));

    const liveBtn = appView.querySelector(".psa-live");
    if (liveBtn) {
      liveBtn.addEventListener("click", () => {
        const box = appView.querySelector(".psa-shots");
        box.innerHTML = `<iframe src="${esc(app.live)}" title="${esc(app.name)} live" allow="autoplay; fullscreen; clipboard-write" loading="lazy"></iframe>`;
        box.style.scrollSnapType = "none";
        liveBtn.remove();
      });
    }

    appView.classList.add("open");
    appView.setAttribute("aria-hidden", "false");
    phoneScreen.classList.add("app-open");
    setInUse(true);
    appView.querySelector(".psa-back").focus({ preventScroll: true });
  };

  function closeApp() {
    if (!appView.classList.contains("open")) return;
    appView.classList.remove("open");
    appView.setAttribute("aria-hidden", "true");
    phoneScreen.classList.remove("app-open");
    setInUse(false);
    if (lastIcon) lastIcon.focus({ preventScroll: true });
    // clear after the close animation so a running live app stops
    setTimeout(() => {
      if (!appView.classList.contains("open")) appView.innerHTML = "";
    }, 300);
  }

  // Mouse drag to scroll the screenshot strip (touch already swipes natively)
  function enableDragScroll(el) {
    let startX = 0;
    let startScroll = 0;
    let dragging = false;
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.classList.add("dragging");
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (dragging) el.scrollLeft = startScroll - (e.clientX - startX);
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("dragging");
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  document.querySelectorAll(".ps-grid a[data-app]").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.preventDefault();
      openApp(icon.dataset.app, icon);
    });
  });

  document.querySelector(".ps-home").addEventListener("click", closeApp);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeApp();
  });
}

// ---------- About tablet: auto-scrolling slideshow ----------
const slidesTrack = document.querySelector(".slides");
const tablet = document.querySelector(".tablet");
const dotsWrap = document.querySelector(".slide-dots");

if (slidesTrack && tablet && dotsWrap) {
  const slides = Array.from(slidesTrack.children);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = null;
  let inView = false;
  let hovering = false;

  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Show slide ${i + 1}`);
    b.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(b);
    return b;
  });

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    slidesTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle("active", j === index));
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function restart() {
    stop();
    if (inView && !hovering && !reduceMotion) timer = setInterval(() => goTo(index + 1), 3500);
  }

  goTo(0);

  tablet.addEventListener("mouseenter", () => {
    hovering = true;
    stop();
  });
  tablet.addEventListener("mouseleave", () => {
    hovering = false;
    restart();
  });

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    restart();
  }).observe(tablet);

  // Swipe / drag to change slides
  const screenEl = tablet.querySelector(".tablet-screen");
  let swipeX = null;
  screenEl.addEventListener("pointerdown", (e) => {
    swipeX = e.clientX;
  });
  screenEl.addEventListener("pointerup", (e) => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX;
    if (Math.abs(dx) > 40) {
      goTo(index + (dx < 0 ? 1 : -1));
      restart();
    }
    swipeX = null;
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
