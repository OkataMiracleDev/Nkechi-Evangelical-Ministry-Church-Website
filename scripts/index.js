// Mobile nav drop down
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");

  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });


// Carousel
const carousel = document.getElementById('carousel');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const leftBlur = document.getElementById('left-blur');
const rightBlur = document.getElementById('right-blur');

let atLeft = true; // start at left page

rightBtn.addEventListener('click', () => {
  carousel.style.transform = 'translateX(calc(-50% - 12px))'; // move to right page
  atLeft = false;

  // Show left button, hide right
  leftBtn.classList.remove('hidden');
  rightBtn.classList.add('hidden');

  // Show left blur, hide right blur
  leftBlur.classList.remove('hidden');
  rightBlur.classList.add('hidden');
});

leftBtn.addEventListener('click', () => {
  carousel.style.transform = 'translateX(0)'; // move to left page
  atLeft = true;

  // Show right button, hide left
  rightBtn.classList.remove('hidden');
  leftBtn.classList.add('hidden');

  // Show right blur, hide left blur
  rightBlur.classList.remove('hidden');
  leftBlur.classList.add('hidden');
});

