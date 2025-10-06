(() => {
  const section = document.getElementById("latest-news");
  if (!section) return;

  const cards = Array.from(section.querySelectorAll(".latest-news__item"));
  if (!cards.length) return;

  const revealed = new Set();
  const onScreen = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const idx = cards.indexOf(el);

        if (entry.isIntersecting) {
          onScreen.add(el);

          if (!revealed.has(el)) {
            revealed.add(el);

            el.style.transitionDelay = `${idx * 300}ms`;

            requestAnimationFrame(() => el.classList.add("is-visible"));

            el.addEventListener(
              "transitionend",
              () => {
                el.style.transitionDelay = "";
              },
              { once: true }
            );
          }
        } else {
          onScreen.delete(el);
        }
      });

      if (onScreen.size === cards.length && !window.__lnHoverBound) {
        window.__lnHoverBound = true;

        cards.forEach((card) => {
          card.style.transition = "transform 0.25s ease";
          card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.03)";
          });
          card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
          });
        });
      }
    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  cards.forEach((c) => observer.observe(c));
})();
