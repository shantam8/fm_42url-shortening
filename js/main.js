let btnToggleMobileMenu = document.querySelector("#btnToggleMobileMenu");
let menuBlock = document.querySelector("#menuBlock");
let body = document.querySelector("body");
let backdrop = document.querySelector("#backdrop");

function toggleMobileMenu() {
  if (menuBlock.classList.contains("open")) {
    setTimeout(() => {
      menuBlock.style.display = "none";
    }, 500);
    menuBlock.classList.toggle("open");
  } else {
      menuBlock.style.display = "block";
      setTimeout(() => {
        menuBlock.classList.toggle("open");
    }, 100);
  }

  btnToggleMobileMenu.classList.toggle("menuOpen");
  body.classList.toggle("backdropActive");
  backdrop.classList.toggle("active");
}

function init() {
  console.log("hi");
  btnToggleMobileMenu.addEventListener("click", toggleMobileMenu);
}

window.onload = init();
