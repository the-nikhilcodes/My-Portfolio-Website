const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");

    const category = btn.getAttribute("data-category");

    projectCards.forEach(card => {
      card.style.display =
        category === "all" || card.getAttribute("data-category") === category
          ? "block"
          : "none";
    });
  });
});
