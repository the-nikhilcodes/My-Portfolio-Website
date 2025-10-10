// ===================================
// ARTICLES PAGE - ENHANCED SCRIPT
// ===================================

document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Articles page initializing...");

    /* ===== NAVBAR FUNCTIONALITY ===== */
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".navlinks");
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
        link.addEventListener("click", toggleMobileMenu);
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

    /* ===== SEARCH FUNCTIONALITY ===== */
    const searchInput = document.getElementById("search-input");
    const articleCards = document.querySelectorAll(".article-card");
    const noResults = document.getElementById("no-results");

    searchInput.addEventListener("input", function (e) {
        const searchTerm = e.target.value.toLowerCase();
        let visibleCount = 0;

        articleCards.forEach((card) => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            const excerpt = card.querySelector(".article-excerpt").textContent.toLowerCase();
            const category = card.getAttribute("data-category").toLowerCase();

            if (
                title.includes(searchTerm) ||
                excerpt.includes(searchTerm) ||
                category.includes(searchTerm)
            ) {
                card.style.display = "block";
                card.style.animation = "fadeInUp 0.6s ease forwards";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.style.display = "block";
        } else {
            noResults.style.display = "none";
        }
    });

    /* ===== CATEGORY FILTER ===== */
    const categoryButtons = document.querySelectorAll(".category-btn");

    categoryButtons.forEach((button) => {
        button.addEventListener("click", function () {
            // Remove active class from all buttons
            categoryButtons.forEach((btn) => btn.classList.remove("active"));
            // Add active class to clicked button
            this.classList.add("active");

            const filterCategory = this.getAttribute("data-category");
            let visibleCount = 0;

            // Clear search input when filtering
            searchInput.value = "";

            articleCards.forEach((card) => {
                const cardCategory = card.getAttribute("data-category");

                // Hide all cards first
                card.style.display = "none";
                card.style.animation = "none";

                // Show cards based on filter
                setTimeout(() => {
                    if (filterCategory === "all" || cardCategory === filterCategory) {
                        card.style.display = "block";
                        card.style.animation = "fadeInUp 0.6s ease forwards";
                        visibleCount++;
                    }
                }, 10);
            });

            // Show/hide no results message
            if (visibleCount === 0) {
                noResults.style.display = "block";
            } else {
                noResults.style.display = "none";
            }
        });
    });

    /* ===== NEWSLETTER FORM ===== */
    const newsletterForm = document.getElementById("newsletter-form");

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector(".btn-primary");
            const originalText = submitButton.innerHTML;

            // Show loading state
            submitButton.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;

                // Show success notification
                showNotification(
                    "Successfully subscribed! Check your email for confirmation.",
                    "success"
                );

                // Reset form
                newsletterForm.reset();
            }, 2000);
        });
    }

    /* ===== LOAD MORE FUNCTIONALITY ===== */
    const loadMoreBtn = document.getElementById("load-more");
    let articlesLoaded = 6;

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", function () {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;

            // Simulate loading more articles
            setTimeout(() => {
                showNotification(
                    "No more articles to load. Stay tuned for new content!",
                    "info"
                );
                this.style.display = "none";
            }, 1500);
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

    /* ===== LAZY LOADING IMAGES ===== */
    const images = document.querySelectorAll("img[loading='lazy']");
    const imageObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
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

    // Observe sections
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(section);
    });

    /* ===== ARTICLE COUNT ANIMATION ===== */
    const articleCount = document.getElementById("article-count");
    if (articleCount) {
        animateCounter(articleCount, 12, 2000);
    }

    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + "+";
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + "+";
            }
        }, 16);
    }

    /* ===== EXTERNAL LINK HANDLING ===== */
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach((link) => {
        link.setAttribute("rel", "noopener noreferrer");
    });

    console.log("✅ Articles page loaded successfully!");
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
