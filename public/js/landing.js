const toonzCards = document.querySelectorAll('.Rwebtoonz');
let outMenuBtn = document.querySelector('.out');
const mobileMenu = document.querySelector('.mobile');
let inMenuBtn = document.querySelector('.in');
const dropArrow = document.querySelector('.material-symbols-outlined');
const subMenu = document.querySelector('.sub-menu');
const genreMobile = document.querySelector('.genre-mobile');
let menuToggle = false;
let preloader = document.querySelector('.preloader-container');

// window.addEventListener('load', function(){
//     preloader.style.display = 'none';
// }) 

// setTimeout(() => {
//     preloader.style.display = 'none';
// }, 1000);

document.addEventListener('DOMContentLoaded', () => {
    // const toonzCards = document.querySelectorAll('.toonz-card');

    toonzCards.forEach((card, i) => {
        card.addEventListener('mouseenter', function() {
            const overlay = document.querySelector(`.overlay${i}`);
            if (overlay) {
                overlay.style.display = 'none';
            }
        });

        card.addEventListener('mouseleave', function() {
            const overlay = document.querySelector(`.overlay${i}`);
            if (overlay) {
                overlay.style.display = 'block';
            }
        });
    });
});


outMenuBtn.addEventListener('click', function(){
    mobileMenu.style.display = 'block';
});

inMenuBtn.addEventListener('click', function(){
    mobileMenu.style.display = 'none';
});

// mobile sub-menu drop down
genreMobile.addEventListener('click', function(){
    if(!menuToggle) {
        dropArrow.style.transform = 'rotate(0deg)';
        subMenu.style.display = 'block';
        menuToggle = true;
    }else{
        dropArrow.style.transform = 'rotate(180deg)';
        subMenu.style.display = 'none';
        menuToggle = false;
    }
})

