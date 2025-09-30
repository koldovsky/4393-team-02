const burger = document.querySelector(".header__burger-menu");
const menuWrapper = document.querySelector(".header__fullscreen-menu-wrapper");
const menuLinks = document.querySelectorAll(".header__menu-link");
const body = document.body;

function toggleMenu() {
  const isMenuOpen = burger.classList.contains("is-active");
  burger.setAttribute("aria-expanded", isMenuOpen ? "false" : "true");
  burger.classList.toggle("is-active");
  menuWrapper.classList.toggle("is-open");
  body.classList.toggle("no-scroll");
}

function closeMenu() {
  burger.classList.remove("is-active");
  menuWrapper.classList.remove("is-open");
  body.classList.remove("no-scroll");
  burger.setAttribute("aria-expanded", "false");
}

burger.addEventListener("click", toggleMenu);

menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});
