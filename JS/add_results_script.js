$(document).ready(function() {
    loadMatchs(); // Appel de la fonction de chargement des matchs depuis le sessionStorage
    loadWinners(0); // Appel de la fonction de chargement des participants au match
    fillTable(); // Appel de la fonction pour remplir le tableau

    // Initialisation de DataTable
    var dataTable = $('#results-table').DataTable({
        "paging": true,
        "pageLength": 10,
        "searching": true,
        "dom": '<"pagination"lfr>t<"pagination"ip>',
        "lengthChange": false,
        "columnDefs": [
            { "orderable": false, "targets": -1 }
        ],
        "language": {
            "sEmptyTable": "Aucune donnée disponible dans le tableau",
            "sInfo": "Affichage de l'élément _START_ à _END_ sur _TOTAL_ éléments",
            "sInfoEmpty": "Affichage de l'élément 0 à 0 sur 0 élément",
            "sInfoFiltered": "(filtré de _MAX_ éléments au total)",
            "sInfoPostFix": "",
            "sInfoThousands": ",",
            "sLengthMenu": "Afficher _MENU_ éléments",
            "sLoadingRecords": "Chargement...",
            "sProcessing": "Traitement...",
            "sSearch": "Rechercher :",
            "sZeroRecords": "Aucun élément correspondant trouvé",
            "oPaginate": {
                "sFirst": "Premier",
                "sLast": "Dernier",
                "sNext": "Suivant",
                "sPrevious": "Précédent"
            },
            "oAria": {
                "sSortAscending": ": activer pour trier la colonne par ordre croissant",
                "sSortDescending": ": activer pour trier la colonne par ordre décroissant"
            }
        }
    });

    // Fonction de recherche pour le tableau
    $('#search').on('input', function() {
        dataTable.search(this.value).draw();
    });

    // Fonction pour enregistrer les résultats dans le sessionStorage
    function saveResults(result) {
        var results = JSON.parse(sessionStorage.getItem('results')) || [];
        results.push(result);
        sessionStorage.setItem('results', JSON.stringify(results));
        location.reload();
    }

    // Fonction pour supprimer les résultats dans le sessionStorage
    function removeResults(row) {
        var rowId = row.attr('id');
        if (rowId) {
            var index = parseInt(rowId.split('-')[1]);
            if (!isNaN(index)) {
                var results = JSON.parse(sessionStorage.getItem('results')) || [];
                results.splice(index, 1);
                sessionStorage.setItem('results', JSON.stringify(results));
                location.reload();
            }
        }
    }

    // Fonction pour charger les matchs depuis le sessionStorage
    function loadMatchs(){
        var matchs = JSON.parse(sessionStorage.getItem('matchs')) || [];
        var dropdownMenu1 = $('.results-match');
        dropdownMenu1.empty(); // Vider le menu déroulant avant d'ajouter de nouvelles équipes
        var dropdownMenu2 = $('.new-results-match');
        dropdownMenu2.empty(); // Vider le menu déroulant avant d'ajouter de nouvelles équipes
    
        matchs.forEach(function(match, index) {
            dropdownMenu1.append($('<option>').val(index).text(match.club1 + ' VS ' + match.club2));
            dropdownMenu2.append($('<option>').val(index).text(match.club1 + ' VS ' + match.club2));
        });
    }
    
    // Détecter le changement de match
    $('select[name="results-match"]').change(function() {
        var selectedIndex = $(this).val(); // Récupérer l'indice de l'option sélectionnée
        loadWinners(selectedIndex);
    });

    // Détecter le changement de match (dans la modification)
    $('select[name="new-results-match"]').change(function() {
        var selectedIndex = $(this).val(); // Récupérer l'indice de l'option sélectionnée
        loadWinners(selectedIndex);
    });
    
    // Fonction pour charger les participants au match
    function loadWinners(index){ 
        var dropdownMenu1 = $('.results-winner');
        dropdownMenu1.empty();
        var dropdownMenu2 = $('.new-results-winner');
        dropdownMenu2.empty();

        var matchs = JSON.parse(sessionStorage.getItem('matchs')) || [];
        if(matchs.length > 0){
            var match = matchs[index]; // Utiliser l'indice pour récupérer le match correspondant
            if(match.club1 && match.club2){
                dropdownMenu1.append($('<option>').val(match.club1).text(match.club1));
                dropdownMenu1.append($('<option>').val(match.club2).text(match.club2));
                dropdownMenu2.append($('<option>').val(match.club1).text(match.club1));
                dropdownMenu2.append($('<option>').val(match.club2).text(match.club2));
            }
        }
    }

    // Fonction pour remplir le tableau avec les données du sessionStorage
    function fillTable() {
        var tableBody = $("#results-table tbody");
        tableBody.empty();

        var results = JSON.parse(sessionStorage.getItem('results')) || [];
        var matchs = JSON.parse(sessionStorage.getItem('matchs')) || [];

        results.forEach(function(result, index) {
            var row = $("<tr>").attr("id", "row-" + index);
            var match = matchs[result.match];
            var cells = [match.type, match.club1, match.club2, match.referee, match.stadium, match.date, result.winner];

            var buttons = [
                { class: "open-see-results-popup-btn", imgSrc: "IMG/see.png" },
                { class: "open-edit-results-popup-btn", imgSrc: "IMG/edit.png" },
                { class: "open-delete-results-popup-btn", imgSrc: "IMG/delete.png" }
            ];

            cells.forEach(function(cell) {
                row.append($("<td>").text(cell));
            });

            var buttonCell = $("<td>");
            buttons.forEach(function(button) {
                var btn = $("<button>").addClass(button.class);
                btn.append($("<img>").attr("src", button.imgSrc));
                buttonCell.append(btn);
            });

            row.append(buttonCell);
            tableBody.append(row);
        });
    }

    // Fonction pour ouvrir la popup d'ajout
    $("#open-add-results-popup-btn").click(function() {
        $("#add-results-popup").show();
    });

    // Fonction pour ajouter un stade avec le formulaire
    $('#add-results-btn').click(function() {
        // Récupérer les valeurs des champs
        var resultMatch = $('#results-match').val();
        var resultWinner = $('#results-winner').val();

        // Vérifier si les champs sont remplis
        if (resultMatch && resultWinner) {
            var results = {
                match: resultMatch,
                winner: resultWinner
            };

            saveResults(results);

            $('#results-match').val('');
            $('#results-winner').val('');
        } else {
            alert('Veuillez remplir tous les champs du formulaire.');
        }
    });

    // Fonction pour ouvrir la popup de visualisation des informations
    $(document).on('click', '.open-see-results-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        var results = JSON.parse(sessionStorage.getItem('results')) || [];
        var matchs = JSON.parse(sessionStorage.getItem('matchs')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var result = results[index];

        match = matchs[result.match];

        $('#see-results-popup #current-match-type').text(match.type);
        $('#see-results-popup #current-match-club1').text(match.club1);
        $('#see-results-popup #current-match-club2').text(match.club2);
        $('#see-results-popup #current-match-referee').text(match.referee);
        $('#see-results-popup #current-match-stadium').text(match.stadium);
        $('#see-results-popup #current-match-date').text(match.date);
        $('#see-results-popup #current-results-winner').text(result.winner);

        $("#see-results-popup").show();
    });

    // Fonction pour ouvrir la popup de modification des informations
    $(document).on('click', '.open-edit-results-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#edit-results-popup').attr('data-id', rowId);
        var results = JSON.parse(sessionStorage.getItem('results')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var result = results[index];

        $('#edit-results-popup #new-results-match').val(result.match);
        loadWinners(result.match);
        $('#edit-results-popup #new-results-winner').val(result.winner);

        $("#edit-results-popup").show();
    });

    // Fonction de modification des informations
    $(document).on('click', '#edit-results-btn', function() {
        var rowId = $('#edit-results-popup').attr('data-id');
        var results = JSON.parse(sessionStorage.getItem('results')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var result = results[index];

        var newMatch = $('#edit-results-popup #new-results-match').val();
        var newWinner = $('#edit-results-popup #new-results-winner').val();

        result.match = newMatch;
        result.winner = newWinner;
        results[index] = result;
        sessionStorage.setItem('results', JSON.stringify(results));

        location.reload();
    });

    // Fonction pour ouvrir la popup de suppression
    $(document).on('click', '.open-delete-results-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#delete-results-popup').attr('data-id', rowId);
        $("#delete-results-popup").show();
    });

    // Fonction pour supprimer
    $(document).on('click', '#delete-btn', function() {
        var rowId = $('#delete-results-popup').data('id');
        if (rowId) {
            var rowElement = $('#' + rowId);
            removeResults(rowElement);
        }
        $("#delete-results-popup").hide();
    });
    
    // Fermeture des popups
    $(".close-popup-btn").click(function() {
        $("#add-results-popup").hide();
        $("#see-results-popup").hide();
        $("#edit-results-popup").hide();
        $("#delete-results-popup").hide();
    });
});
