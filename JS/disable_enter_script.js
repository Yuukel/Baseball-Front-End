// Script pour désactiver la touche entrée qui peut poser soucis sur certaines pages
$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});