document.addEventListener("DOMContentLoaded", function() {
    // Récupérer la valeur de loggedIn dans le sessionStorage
    var loggedIn = sessionStorage.getItem('isLoggedIn');

    // Sélectionner les éléments à activer ou désactiver
    var loginHeader = document.getElementById('login-header');
    var logoutHeader = document.getElementById('logout-header');
    var mobileLoginHeader = document.getElementById('mobile-login-header');
    var mobileLogoutHeader = document.getElementById('mobile-logout-header');

    // Vérifier si l'utilisateur est connecté
    if (loggedIn === 'true') {
        // Activer #login-header et désactiver #logout-header
        loginHeader.style.display = 'none';
        logoutHeader.style.display = 'inline';
        mobileLoginHeader.style.display = 'none';
        mobileLogoutHeader.style.display = 'inline';
    } else {
        // Désactiver #login-header et activer #logout-header
        loginHeader.style.display = 'inline';
        logoutHeader.style.display = 'none';
        mobileLoginHeader.style.display = 'inline';
        mobileLogoutHeader.style.display = 'none';
    }
});
