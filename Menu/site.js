let slide = document.querySelectorAll('.slide-conteiner');
let index = 0;

function ceta_d(){
    slide[index].classList.remove('active');
    index =( index + 1 ) % slide.length;
    slide[index].classList.add('active');
}

function ceta_e(){
    slide[index].classList.remove('active');
    index = (index - 1 + slide.length) % slide.length;
    slide[index].classList.add('active');
}




