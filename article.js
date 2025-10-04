// articles.js - client-side filtering & search for articles.html
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("article-search");
  const filterButtons = Array.from(document.querySelectorAll(".articles-filters .filter-btn"));
  const articleCards = Array.from(document.querySelectorAll(".article-card"));
  const noResults = document.getElementById("no-results");

  let activeCategory = "all";
  let searchQuery = "";

  // Utility: normalize text for comparison
  function norm(text) {
    return (text || "").toString().toLowerCase().trim();
  }

  // Apply filters (category + search)
  function applyFilters() {
    const q = norm(searchQuery);
    let visibleCount = 0;

    articleCards.forEach((card) => {
      const cat = card.dataset.category ? norm(card.dataset.category) : "";
      const tags = card.dataset.tags ? norm(card.dataset.tags) : "";
      const title = norm(card.querySelector(".article-title")?.textContent);
      const excerpt = norm(card.querySelector(".article-excerpt")?.textContent);

      // category filter
      const catMatch = activeCategory === "all" || cat === activeCategory;

      // search filter (check title, excerpt and tags)
      let searchMatch = true;
      if (q.length > 0) {
        searchMatch = title.includes(q) || excerpt.includes(q) || tags.includes(q);
      }

      if (catMatch && searchMatch) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
  }

  // hook up filter buttons
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category || "all";
      applyFilters();
    });
  });

  // debounce helper for search (so it doesn't run too frequently)
  function debounce(fn, wait = 220) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // wire up search input
  const onSearch = debounce(function () {
    searchQuery = searchInput.value || "";
    applyFilters();
  }, 160);

  searchInput.addEventListener("input", onSearch);

  // support keyboard "Enter" on active card to open Read button (improves accessibility)
  articleCards.forEach((card) => {
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const readLink = card.querySelector(".article-actions .btn");
        if (readLink) {
          readLink.click();
        }
      }
    });
  });

  // initial render
  applyFilters();
});
