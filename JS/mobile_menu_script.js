document.getElementById("hamburger-btn").addEventListener("click", function() {
    document.getElementById("hamburger-menu").style.left = 0;
});

document.getElementById("close-menu-btn").addEventListener("click", function() {
    var value = 100;
    document.getElementById("hamburger-menu").style.left = 100 + "%";
});