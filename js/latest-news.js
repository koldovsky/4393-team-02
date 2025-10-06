const cards = document.querySelectorAll(".latest-news .latest-news__item");

cards.forEach((card) => {
  card.style.transition = "transform 0.25s ease";

  card.addEventListener("mouseenter", () => {
    card.style.transform = "scale(1.03)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "scale(1)";
  });
});
