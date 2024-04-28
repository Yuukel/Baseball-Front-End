$(document).ready(function() {
    // Sélectionnez les champs d'entrée du formulaire de connexion
    var usernameInput = $('#username');
    var passwordInput = $('#password');
    var loginButton = $('#login-btn');

    // Ajoutez un gestionnaire d'événements de saisie à ces champs
    usernameInput.on('input', toggleLoginButton);
    passwordInput.on('input', toggleLoginButton);

    // Fonction pour activer ou désactiver le bouton de connexion en fonction de la saisie
    function toggleLoginButton() {
        // Vérifiez si les deux champs sont remplis
        if (usernameInput.val().trim() !== '' && passwordInput.val().trim() !== '') {
            // Si les deux champs sont remplis, activez le bouton de connexion
            loginButton.removeAttr('disabled');
        } else {
            // Sinon, désactivez le bouton de connexion
            loginButton.attr('disabled', 'disabled');
        }
    }
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    var selectedOption = document.querySelector('input[name="captcha"]:checked');
    if (!selectedOption) {
        alert('Veuillez sélectionner une réponse au captcha.');
        event.preventDefault(); // Empêcher l'envoi du formulaire si aucune option n'est sélectionnée
    } else if (selectedOption.value !== 'baseball') { // Vérifier si la réponse sélectionnée est correcte
        alert('Mauvaise réponse au captcha. Veuillez réessayer.');
        event.preventDefault(); // Empêcher l'envoi du formulaire si la réponse est incorrecte
    } else{
        sessionStorage.setItem('isLoggedIn', true);
    }
});
