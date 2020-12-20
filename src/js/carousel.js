import {select} from './settings.js';

let slideIndex = 0;
showSlides();

function showSlides(){
  const slides = document.querySelectorAll(select.carousel.slide);
  const dots = document.querySelectorAll(select.carousel.dot);
  for (let i = 0; i < slides.length; i++){
    slides[i].style.display = 'none';
  }
  slideIndex++;
  slideIndex > slides.length ? slideIndex = 1 : false;
  for(let i = 0; i < dots.length; i++){
    dots[i].classList.remove('active');
  }
  slides[slideIndex-1].style.display = 'block';
  dots[slideIndex-1].classList.add('active');
  setTimeout(showSlides, 5000);
}