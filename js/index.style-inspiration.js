const cards = document.querySelectorAll(".inspiration__list-item");
const closeBtns = document.querySelectorAll(".inspiration__modal-close");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const modalId = card.getAttribute("data-modal");
    const modal = document.getElementById(modalId);
    modal.style.display = "flex";
  });
});

closeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".inspiration__modal").style.display = "none";
  });
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("inspiration__modal")) {
    e.target.style.display = "none";
  }
});
