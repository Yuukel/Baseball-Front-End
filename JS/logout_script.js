$(document).ready(function() {
    $('.logout-link').click(function(event) {
        event.preventDefault(); // Empêcher la redirection par défaut
        // Afficher la popup de déconnexion
        $('.logout-popup').show();
    });

    $(".close-popup-btn").click(function() {
        $("#logout").hide();
    });

    $(".logout-btn").click(function() {
        sessionStorage.setItem('isLoggedIn', false);
        document.location.href="logout.html";
    })
});