var citations = [
    "“ It's supposed to be fun, the man says 'Play Ball' not 'Work Ball' you know. ” &#x2013; Willie Stargell",
    "“ L'opéra en anglais, c'est juste aussi émouvant que le base-ball en italien. ” &#x2013; H. L. Mecken",
    "“ You just can't beat the perso who never gives up. ” &#x2013; Babe Ruth",
    "“ I'd walk through hell in a gasoline suit to play baseball. ” &#x2013; Pete Rose",
    "“ You fall, you get up, you move on. ” &#x2013; Manny Ramirez",
    "“ Every strike brings me closer to the next home run. ” &#x2013; Babe Ruth",
    "“ I'm not good at maths. ” &#x2013; Yu Darvish",
    "“ Le baseball est 90% mental. L'autre moitié, c'est physique. ” &#x2013; Yogi Berra",
    "“ Il y a beaucoup plus d'avenir dans les hamburgers que dans le baseball. ” &#x2013; Ray Kroc",
    "“ Ce n'est pas terminé tant que ce n'est pas terminé. ” &#x2013; Yogi Berra",
  ];

  // Fonction pour choisir aléatoirement une citation et l'afficher
  function afficherCitationAleatoire() {
    // Choix aléatoire d'un indice de citation
    var indice = Math.floor(Math.random() * citations.length);
    // Affichage de la citation dans le paragraphe
    document.getElementById("header-quote").innerHTML = citations[indice];;
  }

  // Appel de la fonction pour afficher une citation aléatoire lors du chargement de la page
  afficherCitationAleatoire();