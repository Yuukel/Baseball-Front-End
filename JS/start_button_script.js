document.getElementById("start-btn").addEventListener("click", function() {
    var loggedIn = sessionStorage.getItem('isLoggedIn') || 'false';

    if(loggedIn === 'false'){
        window.location.href = "login.html";
    } else{
        window.location.href = "menu.html";
    }
});