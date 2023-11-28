var hamburger = document.querySelector("#hamburger")
var menu = document.querySelector(".mob-menu")
var close = document.querySelector("#close")

hamburger.addEventListener('click', () => {
    menu.classList.add('on-menu')

})


close.addEventListener('click', () => {
    menu.classList.remove('on-menu')

})
