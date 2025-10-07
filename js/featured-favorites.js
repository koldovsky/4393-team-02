const swiper = new Swiper(".swiper", {
  navigation: {
    nextEl: ".featured-favorites__nav-arrow_next",
    prevEl: ".featured-favorites__nav-arrow_prev",
  },
  spaceBetween: 40,
  breakpoints: {
    320: {
      // phones
      slidesPerView: 1,
      spaceBetween: 20,
    },
    576: {
      // small tablets
      slidesPerView: 2,
      spaceBetween: 30,
    },
    768: {
      // tablets
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1200: {
      // laptops & full HD
      slidesPerView: 4,
      spaceBetween: 60,
    },
    1600: {
      // big screens
      slidesPerView: 4,
      spaceBetween: 60,
    },
  },
});
