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

(() => {
  const modalTexts = [
    "5 Easy Ways to Refresh Your Space. Give your home a quick lift with simple changes. Add a pop of color through cushions or artwork, introduce fresh plants for natural energy, and reorganize your layout to create more openness. Small updates can make your space feel brand new without spending much.",
    "How to Create a Cozy Atmosphere. Transform your home into a warm retreat with soft lighting, natural textures, and earthy tones. Layer candles, blankets, and gentle music to create a calm, inviting space that feels like a comforting hug after a long day.",
    "From Blank Wall to Wow Moment. Turn empty walls into stunning focal points with a curated gallery of your favorite pieces. Mix frames, art styles, and personal photos to reflect your story. Balance spacing and composition to create a wall that feels stylish, cohesive, and uniquely yours.",
    "Style That’s Kind to the Planet. Embrace sustainable living with natural materials, upcycled furniture, and timeless design. Eco-friendly choices not only protect the planet but also bring warmth, balance, and authenticity into your home.",
  ];

  const section = document.getElementById("latest-news");
  if (!section) return;

  const buttons = section.querySelectorAll(".latest-news__link.button");
  const backdrop = document.getElementById("lnModal");
  const closeBtn = document.getElementById("lnModalClose");
  const content = document.getElementById("lnModalContent");
  if (!buttons.length || !backdrop || !closeBtn || !content) return;

  let lastFocused = null;

  buttons.forEach((btn, idx) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      lastFocused = e.currentTarget;
      content.textContent = modalTexts[idx] || "";
      backdrop.setAttribute("aria-hidden", "false");
      closeBtn.focus();
      document.addEventListener("keydown", onEsc);
    });
  });

  function closeModal() {
    backdrop.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onEsc);
    if (lastFocused) lastFocused.focus();
  }
  function onEsc(e) {
    if (e.key === "Escape") closeModal();
  }

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
})();
