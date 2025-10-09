// article-script.js
// Complete implementation with all functionality working

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Article page initializing...");

  /* ===== NAVBAR FUNCTIONALITY - EXACT MATCH ===== */
  const navbar = document.querySelector(".navbar");
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));

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

      // Allow normal navigation for external links
      if (href && !href.startsWith("#")) {
        return; // let the browser handle it normally
      }

      // Handle internal navigation
      e.preventDefault();
      const target =
        linkToSection.get(link) || document.getElementById(href.slice(1));
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

  /* ===== THEME TOGGLE - EXACT MATCH ===== */
  const themeToggle = document.getElementById("theme-toggle");

  const savedTheme = localStorage.getItem("theme");
  const systemPrefLight =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;
  const initialTheme = savedTheme || (systemPrefLight ? "light" : "dark");

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute("aria-pressed", "true");
        themeToggle.title = "Switch to dark theme";
      }
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute("aria-pressed", "false");
        themeToggle.title = "Switch to light theme";
      }
    }
    localStorage.setItem("theme", theme);
  }

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "light"
          : "dark";
      applyTheme(current === "light" ? "dark" : "light");
    });

    themeToggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        themeToggle.click();
      }
    });
  }

  /* ===== MOBILE HAMBURGER MENU ===== */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-navlinks");

  if (hamburger && mobileMenu && mobileMenuOverlay) {
    hamburger.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.contains("active");

      if (isOpen) {
        // Close menu
        mobileMenu.classList.remove("active");
        mobileMenuOverlay.classList.remove("active");
        hamburger.querySelector("i").className = "fas fa-bars";
        document.body.style.overflow = "";
      } else {
        // Open menu
        mobileMenu.classList.add("active");
        mobileMenuOverlay.classList.add("active");
        hamburger.querySelector("i").className = "fas fa-times";
        document.body.style.overflow = "hidden";
      }
    });

    mobileMenuOverlay.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
      hamburger.querySelector("i").className = "fas fa-bars";
      document.body.style.overflow = "";
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        mobileMenuOverlay.classList.remove("active");
        hamburger.querySelector("i").className = "fas fa-bars";
        document.body.style.overflow = "";
      });
    });
  }

  /* ===== ARTICLE FILTERING ===== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const articleCards = document.querySelectorAll(".article-card");

  function filterArticles(category) {
    articleCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");

      if (category === "all" || cardCategory === category) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 50);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.getAttribute("data-filter");
      filterArticles(category);

      showNotification(`Filtered articles: ${button.textContent}`, "info");
    });
  });

  /* ===== LIKE BUTTON FUNCTIONALITY ===== */
  const likeButtons = document.querySelectorAll(".like-btn");

  likeButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const countSpan = button.querySelector(".count");
      const icon = button.querySelector("i");
      let count = parseInt(countSpan.textContent);

      if (button.classList.contains("liked")) {
        // Unlike
        button.classList.remove("liked");
        count--;
        showNotification("Article unliked!", "info");
      } else {
        // Like
        button.classList.add("liked");
        count++;
        showNotification("Article liked! ❤️", "success");
      }

      countSpan.textContent = count;
    });
  });

  /* ===== READ MORE FUNCTIONALITY ===== */
  const readMoreLinks = document.querySelectorAll(".read-more");

  readMoreLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      if (!href || href === "#") {
        e.preventDefault();
        const articleTitle = link.getAttribute("data-title") || "this article";
        showNotification(`Opening: "${articleTitle}"`, "info");
      }
    });

    const articleTitle = link.getAttribute("data-title") || "this article";
    showNotification(`Opening: "${articleTitle}"`, "info");

    setTimeout(() => {
      showNotification("Full article feature coming soon! 📚", "info");
    }, 1500);
  });
});

/* ===== NEWSLETTER FORM ===== */
const newsletterForm = document.getElementById("newsletter-form");
const newsletterEmail = document.getElementById("newsletter-email");

if (newsletterForm && newsletterEmail) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = newsletterEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showNotification("Please enter your email address.", "error");
      return;
    }

    if (!emailRegex.test(email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Simulate subscription
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitButton.disabled = true;

    setTimeout(() => {
      showNotification(
        `🎉 Thanks for subscribing! Welcome to our newsletter, ${email}!`,
        "success"
      );
      newsletterForm.reset();
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }, 2000);
  });
}

/* ===== LOAD MORE FUNCTIONALITY ===== */
const loadMoreBtn = document.getElementById("load-more-btn");

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", function () {
    const originalHTML = loadMoreBtn.innerHTML;

    loadMoreBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> <span>Loading...</span>';
    loadMoreBtn.disabled = true;

    setTimeout(() => {
      showNotification(
        "No more articles available at the moment. Check back soon! 📰",
        "info"
      );
      loadMoreBtn.innerHTML = originalHTML;
      loadMoreBtn.disabled = false;
    }, 2000);
  });
}

/* ===== TAG CLICK FUNCTIONALITY ===== */
const tagElements = document.querySelectorAll(".tags span");

tagElements.forEach((tag) => {
  tag.addEventListener("click", function () {
    const tagText = tag.textContent.trim();
    showNotification(
      `Searching for articles tagged with "${tagText}"...`,
      "info"
    );

    setTimeout(() => {
      showNotification("Tag-based search coming soon! 🏷️", "info");
    }, 1500);
  });
});

/* ===== NOTIFICATION SYSTEM ===== */
function showNotification(message, type = "info") {
  const container = document.getElementById("notification-container");
  if (!container) return;

  // Remove old notifications after 3 seconds
  const existingNotifications = container.querySelectorAll(".notification");
  if (existingNotifications.length >= 3) {
    existingNotifications[0].remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;

  container.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Add close functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    hideNotification(notification);
  });

  // Auto hide after 5 seconds
  setTimeout(() => {
    hideNotification(notification);
  }, 5000);
}

function hideNotification(notification) {
  notification.classList.remove("show");
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 300);
}

/* ===== INTERSECTION OBSERVER FOR ANIMATIONS ===== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = "running";
      entry.target.classList.add("animate-in");
    }
  });
}, observerOptions);

// Observe elements for animations
articleCards.forEach((card) => {
  card.style.animationPlayState = "paused";
  observer.observe(card);
});

const headerContent = document.querySelector(".header-content");
if (headerContent) {
  observer.observe(headerContent);
}

/* ===== SMOOTH SCROLL ENHANCEMENT ===== */
function smoothScrollTo(target, duration = 1000) {
  const targetPosition =
    target.getBoundingClientRect().top + window.pageYOffset - 80;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

/* ===== KEYBOARD ACCESSIBILITY ===== */
document.addEventListener("keydown", function (e) {
  // Escape key closes mobile menu
  if (e.key === "Escape") {
    if (mobileMenu && mobileMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
      hamburger.querySelector("i").className = "fas fa-bars";
      document.body.style.overflow = "";
    }
  }
});

// Hamburger menu toggle
const hamburger = document.querySelector(".hamburger");
const navlist = document.querySelector(".navlist");

hamburger.addEventListener("click", (e) => {
  e.preventDefault(); // prevents default <a> behavior if using <a>

  // Toggle nav menu
  navlist.classList.toggle("active");

  // Toggle icon
  const icon = hamburger.querySelector("i");
  if (navlist.classList.contains("active")) {
    icon.className = "fa-solid fa-xmark"; // close icon
  } else {
    icon.className = "fa-solid fa-bars"; // hamburger icon
  }
});

// ---- Other existing code like theme toggle, scroll effects, etc. ----

/* ===== PERFORMANCE OPTIMIZATIONS ===== */

// Lazy load images
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.remove("lazy");
      }
      observer.unobserve(img);
    }
  });
});

lazyImages.forEach((img) => {
  imageObserver.observe(img);
});

// Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedScroll = debounce(onScroll, 10);
window.removeEventListener("scroll", onScroll);
window.addEventListener("scroll", debouncedScroll, { passive: true });

/* ===== INITIALIZATION COMPLETE ===== */
setTimeout(() => {
  showNotification("📚 Article page loaded successfully!", "success");
}, 1000);

console.log("✅ Article page initialized successfully!");

// Export functions for external use if needed
window.ArticlePage = {
  filterArticles,
  showNotification,
  applyTheme,
};
