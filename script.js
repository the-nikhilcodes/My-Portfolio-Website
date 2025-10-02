// main.js
// Task1 + Theme Toggle integrated
document.addEventListener("DOMContentLoaded", function () {
  /* ---------- NAVBAR / SCROLL / ACTIVE LINK (Task 1 from earlier) ---------- */
  const navbar = document.querySelector(".navbar");
  const navLinks = Array.from(document.querySelectorAll(".navlinks"));
  const sections = Array.from(document.querySelectorAll("section"));

  function toIdCandidate(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }

  const linkToSection = new Map();

  navLinks.forEach((link) => {
    let href = link.getAttribute("href") || "";
    let targetSection = null;

    if (href.startsWith("#") && href.length > 1) {
      targetSection = document.getElementById(href.slice(1));
    }

    if (!targetSection && link.dataset.target) {
      targetSection = document.getElementById(link.dataset.target);
    }

    if (!targetSection) {
      const idCandidate = toIdCandidate(link.textContent || "");
      targetSection = document.getElementById(idCandidate);
      if (!targetSection) {
        targetSection = sections.find((sec) => {
          const classes = Array.from(sec.classList || []);
          return (
            classes.includes(idCandidate) ||
            classes.some((c) => c.toLowerCase().includes(idCandidate)) ||
            (sec.id && sec.id.toLowerCase().includes(idCandidate))
          );
        });
      }
    }

    if (!targetSection && toIdCandidate(link.textContent) === "home") {
      targetSection = document.documentElement;
    }

    linkToSection.set(link, targetSection || null);
  });

  function scrollToSection(targetEl) {
    if (!targetEl) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (targetEl === document.documentElement) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const rect = targetEl.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const offset = Math.max(0, absoluteTop - navHeight - 8);
    window.scrollTo({ top: offset, behavior: "smooth" });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#") || href === "#") {
        if (href === "#" || !href.startsWith("#")) {
          e.preventDefault();
          const target = linkToSection.get(link);
          scrollToSection(target);
        }
        return;
      }
      e.preventDefault();
      const target = linkToSection.get(link) || document.getElementById(href.slice(1));
      scrollToSection(target);
    });
  });

  function updateActiveLink() {
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const scrollPos = window.scrollY + navHeight + 20;
    let currentSection = null;
    let currentTop = -Infinity;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      if (top <= scrollPos && top > currentTop) {
        currentTop = top;
        currentSection = sec;
      }
    });
    let activeLink = null;
    if (currentSection) {
      for (const [link, sec] of linkToSection.entries()) {
        if (sec === currentSection) {
          activeLink = link;
          break;
        }
      }
    } else {
      for (const [link, sec] of linkToSection.entries()) {
        const candidate = (link.textContent || "").trim().toLowerCase();
        if (candidate === "home" || sec === document.documentElement) {
          activeLink = link;
          break;
        }
      }
    }
    navLinks.forEach((l) => l.classList.remove("active"));
    if (activeLink) activeLink.classList.add("active");
  }

  function updateNavbarScrolled() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavbarScrolled();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  updateNavbarScrolled();
  updateActiveLink();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    updateActiveLink();
  });

  /* ----------------------
     THEME TOGGLE (Dark <-> Light)
     ---------------------- */
  const themeToggle = document.getElementById("theme-toggle");
  document.body.classList.toggle("light-mode");


  // decide initial theme: localStorage -> system preference -> 'dark'
  const savedTheme = localStorage.getItem("theme");
  const systemPrefLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const initialTheme = savedTheme || (systemPrefLight ? "light" : "dark");

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        themeToggle.setAttribute("aria-pressed", "true");
        themeToggle.title = "Switch to dark theme";
      }
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        themeToggle.setAttribute("aria-pressed", "false");
        themeToggle.title = "Switch to light theme";
      }
    }
    localStorage.setItem("theme", theme);
  }

  // apply on load
  applyTheme(initialTheme);

  // click handler
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      applyTheme(current === "light" ? "dark" : "light");
    });

    // keyboard support: Enter / Space
    themeToggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        themeToggle.click();
      }
    });
  }
});
