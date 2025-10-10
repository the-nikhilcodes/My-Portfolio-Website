// ===================================
// MODERN PORTFOLIO - ENHANCED SCRIPT
// ===================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Portfolio initializing...");

  /* ===== NAVBAR FUNCTIONALITY ===== */
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".navlinks");
  const sections = document.querySelectorAll("section");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-navlinks");

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Update active link based on scroll position
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });

    mobileNavLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Smooth scroll for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  /* ===== MOBILE MENU ===== */
  function toggleMobileMenu() {
    mobileMenu.classList.toggle("active");
    mobileMenuOverlay.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "";
  }

  hamburger.addEventListener("click", toggleMobileMenu);
  mobileMenuOverlay.addEventListener("click", toggleMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        toggleMobileMenu();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          setTimeout(() => {
            targetSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 300);
        }
      }
    });
  });

  /* ===== THEME TOGGLE ===== */
  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  // Check for saved theme preference
  const currentTheme = localStorage.getItem("theme") || "dark";
  htmlElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener("click", function () {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);

    // Add animation effect
    this.style.transform = "rotate(360deg)";
    setTimeout(() => {
      this.style.transform = "rotate(0deg)";
    }, 300);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    if (theme === "dark") {
      icon.className = "fas fa-sun";
      themeToggle.setAttribute("aria-pressed", "false");
    } else {
      icon.className = "fas fa-moon";
      themeToggle.setAttribute("aria-pressed", "true");
    }
  }

  /* ===== PROJECT FILTER ===== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      projectCards.forEach((card) => {
        // Hide all cards first
        card.style.display = "none";
        card.style.animation = "none";

        // Show cards based on filter
        setTimeout(() => {
          if (
            filterValue === "all" ||
            card.getAttribute("data-category") === filterValue ||
            card.getAttribute("data-category") === "all"
          ) {
            card.style.display = "block";
            card.style.animation = "fadeInUp 0.6s ease forwards";
          }
        }, 10);
      });
    });
  });

  /* ===== CONTACT FORM (Formspree) ===== */
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Elements & original button text
      const submitButton =
        contactForm.querySelector(".btn-submit") ||
        contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton ? submitButton.innerHTML : null;

      // Get and trim values
      const name = (
        document.getElementById("name") || { value: "" }
      ).value.trim();
      const email = (
        document.getElementById("email") || { value: "" }
      ).value.trim();
      const subject = (
        document.getElementById("subject") || { value: "" }
      ).value.trim();
      const message = (
        document.getElementById("message") || { value: "" }
      ).value.trim();

      // Basic client-side validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!name || !email || !message) {
        showNotification("Please fill in name, email and message.", "error");
        return;
      }
      if (!emailRegex.test(email)) {
        showNotification("Please enter a valid email address.", "error");
        return;
      }

      // Disable button + show spinner
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }

      try {
        // Use FormData so Formspree receives the fields as a normal form post
        const formData = new FormData(contactForm);

        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json", // tells Formspree we expect JSON back
          },
        });

        if (response.ok) {
          // success
          showNotification(
            "✅ Message sent — thank you! I'll get back to you soon.",
            "success"
          );
          contactForm.reset();
          console.log("Formspree response ok");
        } else {
          // response not ok — try to parse error info
          let data = null;
          try {
            data = await response.json();
          } catch (err) {
            // not JSON or empty
          }

          if (data && data.errors && data.errors.length) {
            const msg = data.errors.map((x) => x.message).join(" — ");
            showNotification(msg, "error");
            console.warn("Formspree errors:", data.errors);
          } else {
            showNotification(
              "❌ Failed to send message. Please try again later.",
              "error"
            );
            console.warn(
              "Formspree non-ok response",
              response.status,
              response.statusText
            );
          }
        }
      } catch (err) {
        // network or CORS error
        showNotification(
          "⚠ Network error — please check your connection and try again.",
          "error"
        );
        console.error("Form submission error:", err);
      } finally {
        // restore button state
        if (submitButton) {
          submitButton.disabled = false;
          if (originalText !== null) submitButton.innerHTML = originalText;
        }
      }
    });
  }

  /* ===== NOTIFICATION SYSTEM ===== */
  function showNotification(message, type = "info") {
    const container =
      document.getElementById("notification-container") ||
      createNotificationContainer();
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

    container.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // Close button
    notification
      .querySelector(".notification-close")
      .addEventListener("click", function () {
        closeNotification(notification);
      });

    // Auto close after 5 seconds
    setTimeout(() => {
      closeNotification(notification);
    }, 5000);
  }

  function createNotificationContainer() {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);
    return container;
  }

  function closeNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }

  /* ===== SCROLL ANIMATIONS ===== */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });

  /* ===== TYPING EFFECT (Optional Enhancement) ===== */
  const heroSubtitle = document.querySelector(".hero-subtitle");
  if (heroSubtitle) {
    const originalText = heroSubtitle.textContent;
    const words = originalText.split(" | ");
    let currentIndex = 0;

    function typeWriter() {
      heroSubtitle.style.opacity = "0";
      setTimeout(() => {
        heroSubtitle.textContent = words[currentIndex];
        heroSubtitle.style.opacity = "1";
        currentIndex = (currentIndex + 1) % words.length;
      }, 300);
    }

    // Uncomment to enable typing effect
    // setInterval(typeWriter, 3000);
  }

  /* ===== LAZY LOADING IMAGES ===== */
  const images = document.querySelectorAll("img[loading='lazy']");
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src; // Trigger load
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );

  images.forEach((img) => imageObserver.observe(img));

  /* ===== PREVENT EMPTY FORM SUBMISSION ===== */
  const formInputs = document.querySelectorAll(
    "input[required], textarea[required]"
  );
  formInputs.forEach((input) => {
    input.addEventListener("invalid", function (e) {
      e.preventDefault();
      this.classList.add("error");
      showNotification(`Please fill in the ${this.name} field`, "error");
    });

    input.addEventListener("input", function () {
      this.classList.remove("error");
    });
  });

  /* ===== EXTERNAL LINK HANDLING ===== */
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });

  /* ===== PERFORMANCE OPTIMIZATION ===== */
  // Debounce scroll event
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    function () {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(function () {
        // Scroll-based animations
      });
    },
    { passive: true }
  );

  console.log("✅ Portfolio loaded successfully!");
});

/* ===== UTILITY FUNCTIONS ===== */

// Smooth scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification("Copied to clipboard!", "success");
  });
}

// Format date
function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
