// main.js
// Task 1: Sticky navbar, smooth scroll with offset, and active link highlighting
// Put this file in your project root and include <script src="main.js" defer></script> before </body>

document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const navLinks = Array.from(document.querySelectorAll(".navlinks")); // your nav link elements
  const sections = Array.from(document.querySelectorAll("section")); // all sections on page

  // Helper to sanitize text -> id candidate (e.g., "Web Development" -> "web-development")
  function toIdCandidate(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }

  // Build a map from link element -> target section element (or null)
  const linkToSection = new Map();

  navLinks.forEach((link) => {
    let href = link.getAttribute("href") || "";
    let targetSection = null;

    // If href is like "#about", use it
    if (href.startsWith("#") && href.length > 1) {
      targetSection = document.getElementById(href.slice(1));
    }

    // If not found, check for data-target attribute
    if (!targetSection && link.dataset.target) {
      targetSection = document.getElementById(link.dataset.target);
    }

    // Try mapping by link text -> matching section id or class
    if (!targetSection) {
      const idCandidate = toIdCandidate(link.textContent || "");
      // 1) try id
      targetSection = document.getElementById(idCandidate);
      // 2) try a section whose classList contains candidate or contains candidate substring
      if (!targetSection) {
        targetSection = sections.find((sec) => {
          // check exact class or class containing candidate
          const classes = Array.from(sec.classList || []);
          return (
            classes.includes(idCandidate) ||
            classes.some((c) => c.toLowerCase().includes(idCandidate)) ||
            (sec.id && sec.id.toLowerCase().includes(idCandidate))
          );
        });
      }
    }

    // Special-case "home" -> top of page (no section)
    if (!targetSection && (toIdCandidate(link.textContent) === "home")) {
      targetSection = document.documentElement; // will scroll to top
    }

    linkToSection.set(link, targetSection || null);
  });

  // Smooth scroll handler that respects navbar height
  function scrollToSection(targetEl) {
    if (!targetEl) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // If target is the root (documentElement), scroll to top
    if (targetEl === document.documentElement) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const navHeight = navbar ? navbar.offsetHeight : 0;
    const rect = targetEl.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const offset = Math.max(0, absoluteTop - navHeight - 8); // -8 px for small margin

    window.scrollTo({ top: offset, behavior: "smooth" });
  }

  // Attach click handlers to nav links for smooth scrolling
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // If link points to an external URL (not starting with #), do nothing
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#") || href === "#") {
        // still allow mapping by text when href="#" — prevent default then scroll
        if (href === "#" || !href.startsWith("#")) {
          e.preventDefault();
          const target = linkToSection.get(link);
          scrollToSection(target);
        }
        return;
      }

      // If href starts with '#' and length>1, scroll to the target id properly
      e.preventDefault();
      const target = linkToSection.get(link) || document.getElementById(href.slice(1));
      scrollToSection(target);
    });
  });

  // Update active nav link based on scroll position
  function updateActiveLink() {
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const scrollPos = window.scrollY + navHeight + 20; // 20px buffer

    // Find the section with largest offsetTop <= scrollPos
    let currentSection = null;
    let currentTop = -Infinity;

    sections.forEach((sec) => {
      // compute top for this section (treat documentElement specially)
      const top = sec.offsetTop;
      if (top <= scrollPos && top > currentTop) {
        currentTop = top;
        currentSection = sec;
      }
    });

    // If no section found (we're at the very top), currentSection stays null -> set home
    // Determine which link corresponds to currentSection
    let activeLink = null;
    if (currentSection) {
      // find link mapped to this section
      for (const [link, sec] of linkToSection.entries()) {
        if (sec === currentSection) {
          activeLink = link;
          break;
        }
      }
    } else {
      // find "Home" link by text or mapped to documentElement
      for (const [link, sec] of linkToSection.entries()) {
        const candidate = (link.textContent || "").trim().toLowerCase();
        if (candidate === "home" || sec === document.documentElement) {
          activeLink = link;
          break;
        }
      }
    }

    // Remove .active from all and add to activeLink (if found)
    navLinks.forEach((l) => l.classList.remove("active"));
    if (activeLink) activeLink.classList.add("active");
  }

  // Toggle navbar.scrolled class when the user scrolls down
  function updateNavbarScrolled() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Throttle using requestAnimationFrame for better performance
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

  // Initial run
  updateNavbarScrolled();
  updateActiveLink();

  // Event listeners
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    // recalc on resize to keep offset correct
    updateActiveLink();
  });
});
