// Script pour le bouton de menu en format mobile

document.getElementById("hamburger-btn").addEventListener("click", function() {
    document.getElementById("hamburger-menu").style.left = 0;
});

document.getElementById("close-menu-btn").addEventListener("click", function() {
    document.getElementById("hamburger-menu").style.left = 100 + "%";
});