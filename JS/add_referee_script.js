$(document).ready(function() {
    fillTable(); // Appel de la fonction pour remplir le tableau

    // Initialisation de DataTable
    var dataTable = $('#referee-table').DataTable({
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

    // Fonction pour enregistrer un arbitre dans le sessionStorage
    function saveReferee(referee) {
        var referees = JSON.parse(sessionStorage.getItem('referees')) || [];
        referees.push(referee);
        sessionStorage.setItem('referees', JSON.stringify(referees));
        location.reload();
    }

    // Fonction pour supprimer un arbitre dans le sessionStorage
    function removeReferee(row) {
        var rowId = row.attr('id');
        if (rowId) {
            var index = parseInt(rowId.split('-')[1]);
            if (!isNaN(index)) {
                var referees = JSON.parse(sessionStorage.getItem('referees')) || [];
                referees.splice(index, 1);
                sessionStorage.setItem('referees', JSON.stringify(referees));
                location.reload();
            }
        }
    }

    // Fonction pour remplir le tableau avec les données du sessionStorage
    function fillTable() {
        var tableBody = $("#referee-table tbody");
        tableBody.empty();

        var referees = JSON.parse(sessionStorage.getItem('referees')) || [];

        referees.forEach(function(referee, index) {
            var row = $("<tr>").attr("id", "row-" + index);
            var cells = [referee.name + ' ' + referee.lastName, referee.country];

            var buttons = [
                { class: "open-see-referee-popup-btn", imgSrc: "IMG/see.png" },
                { class: "open-edit-referee-popup-btn", imgSrc: "IMG/edit.png" },
                { class: "open-delete-referee-popup-btn", imgSrc: "IMG/delete.png" }
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
    $("#open-add-referee-popup-btn").click(function() {
        $("#add-referee-popup").show();
    });

    // Fonction pour ajouter un arbitre avec le formulaire
    $('#add-referee-btn').click(function() {
        var refereeName = $('#first-name').val();
        var refereeLastName = $('#last-name').val();
        var refereeCountry = $('#country').val();

        // Vérifier si les champs sont remplis
        if (refereeName && refereeLastName && refereeCountry) {
            var referee = {
                name: refereeName,
                lastName: refereeLastName,
                country: refereeCountry
            };

            // Enregistrer l'arbitre dans le sessionStorage
            saveReferee(referee);

            // Effacer les champs du formulaire
            $('#first-name').val('');
            $('#last-name').val('');
            $('#country').val('');
        } else {
            alert('Veuillez remplir tous les champs du formulaire.');
        }
    });
    
    // Fonction pour ouvrir la popup de visualisation des informations
    $(document).on('click', '.open-see-referee-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        var referees = JSON.parse(sessionStorage.getItem('referees')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var referee = referees[index];

        $('#see-referee-popup #current-referee-name').text(referee.name + ' ' + referee.lastName);
        $('#see-referee-popup #current-referee-country').text(referee.country);

        $("#see-referee-popup").show();
    });

    // Fonction pour ouvrir la popup de modification des informations
    $(document).on('click', '.open-edit-referee-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#edit-referee-popup').attr('data-id', rowId);
        var referees = JSON.parse(sessionStorage.getItem('referees')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var referee = referees[index];

        $('#edit-referee-popup #new-first-name').val(referee.name);
        $('#edit-referee-popup #new-last-name').val(referee.lastName);
        $('#edit-referee-popup #new-referee-country').val(referee.country);

        $("#edit-referee-popup").show();
    });

    // Fonction de modification des informations
    $(document).on('click', '#edit-referee-btn', function() {
        var rowId = $('#edit-referee-popup').attr('data-id');
        var referees = JSON.parse(sessionStorage.getItem('referees')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var referee = referees[index];

        var newName = $('#edit-referee-popup #new-first-name').val();
        var newLastName = $('#edit-referee-popup #new-last-name').val();
        var newCountry = $('#edit-referee-popup #new-referee-country').val();

        referee.name = newName;
        referee.lastName = newLastName;
        referee.country = newCountry;
        referees[index] = referee;
        sessionStorage.setItem('referees', JSON.stringify(referees));

        location.reload();
    });

    // Fonction pour ouvrir la popup de suppression
    $(document).on('click', '.open-delete-referee-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#delete-referee-popup').attr('data-id', rowId);
        $("#delete-referee-popup").show();
    });

    // Fonction pour supprimer
    $(document).on('click', '#delete-btn', function() {
        var rowId = $('#delete-referee-popup').data('id');
        if (rowId) {
            var rowElement = $('#' + rowId);
            removeReferee(rowElement);
        }
        $("#delete-referee-popup").hide();
    });

    // Fermeture des popups
    $(".close-popup-btn").click(function() {
        $("#add-referee-popup").hide();
        $("#see-referee-popup").hide();
        $("#edit-referee-popup").hide();
        $("#delete-referee-popup").hide();
    });
});
