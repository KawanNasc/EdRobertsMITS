let slide = document.querySelectorAll('.slide-container');
let index = 0;

function seta_d() {
    slide[index].classList.remove('active');
    index = (index + 1) % slide.length;
    slide[index].classList.add('active');
}

function seta_e() {
    slide[index].classList.remove('active');
    index = (index - 1 + slide.length) % slide.length;
    slide[index].classList.add('active');
}