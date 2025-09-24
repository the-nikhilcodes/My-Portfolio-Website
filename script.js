// const filterBtns = document.querySelectorAll(".filter-btn");
// const projectCards = document.querySelectorAll(".project-card");

// filterBtns.forEach(btn => {
//   btn.addEventListener("click", () => {
//     document.querySelector(".filter-btn.active").classList.remove("active");
//     btn.classList.add("active");

//     const category = btn.getAttribute("data-category");

//     projectCards.forEach(card => {
//       card.style.display =
//         category === "all" || card.getAttribute("data-category") === category
//           ? "block"
//           : "none";
//     });
//   });
// });


// // For Home Page and About section JS
// <script>
//   const hamburger = document.getElementById('hamburger');
//   const navlist = document.getElementById('navlist');

//   hamburger.addEventListener('click', () => {
//     const isOpen = navlist.classList.toggle('open');
//     if (isOpen) {
//       navlist.style.display = 'flex';
//       navlist.style.flexDirection = 'column';
//       navlist.style.position = 'absolute';
//       navlist.style.top = '80px';
//       navlist.style.right = '20px';
//       navlist.style.background = 'rgba(10,10,10,0.95)';
//       navlist.style.padding = '18px';
//       navlist.style.borderRadius = '10px';
//       navlist.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
//     } else {
//       navlist.style.display = '';
//       navlist.style.flexDirection = '';
//       navlist.style.position = '';
//       navlist.style.top = '';
//       navlist.style.right = '';
//       navlist.style.background = '';
//       navlist.style.padding = '';
//       navlist.style.borderRadius = '';
//       navlist.style.boxShadow = '';
//     }
//   });

//   // optional: close mobile menu when clicking a link
//   document.querySelectorAll('.navlist a').forEach(link => {
//     link.addEventListener('click', () => {
//       if (window.innerWidth <= 760) {
//         navlist.classList.remove('open');
//         navlist.style.display = '';
//       }
//     });
//   });
// </script>
