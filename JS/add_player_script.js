$(document).ready(function() {
    loadClubs(); // Charger les équipes enregistrées depuis le sessionStorage au chargement de la page
    fillTable();

    var dataTable = $('#player-table').DataTable({
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

    $('#search').on('input', function() {
        dataTable.search(this.value).draw();
    });

    // Fonction pour enregistrer une équipe dans le sessionStorage
    function savePlayer(player) {
        var players = JSON.parse(sessionStorage.getItem('players')) || [];
        players.push(player);
        sessionStorage.setItem('players', JSON.stringify(players));
        location.reload();
    }

    function removePlayer(row) {
        var rowId = row.attr('id');
        if (rowId) {
            var index = parseInt(rowId.split('-')[1]);
            if (!isNaN(index)) {
                var players = JSON.parse(sessionStorage.getItem('players')) || [];
                players.splice(index, 1);
                sessionStorage.setItem('players', JSON.stringify(players));
                location.reload();
            }
        }
    }
    
    // Charger les équipes depuis le sessionStorage et les afficher dans le menu déroulant
    function loadClubs() {
        var clubs = JSON.parse(sessionStorage.getItem('clubs')) || [];
        console.log(clubs.length);
        var selectedGender = $('input[name="player-gender"]:checked').val();
        var dropdownMenus = $('.player-club'); // Sélectionnez les éléments par leur classe
        dropdownMenus.empty(); // Videz les menus déroulants avant d'ajouter de nouvelles équipes
    
        clubs.forEach(function(club) {
            if (club.gender === selectedGender) {
                dropdownMenus.append($('<option>').val(club.name).text(club.name));
            }
        });
    }
    
    function fillTable() {
        var tableBody = $("#player-table tbody");
        tableBody.empty();

        var players = JSON.parse(sessionStorage.getItem('players')) || [];

        players.forEach(function(player, index) {
            var row = $("<tr>").attr("id", "row-" + index);
            var cells = [player.name + ' ' + player.lastName, player.gender, player.club, player.role];

            var buttons = [
                { class: "open-see-player-popup-btn", imgSrc: "IMG/see.png" },
                { class: "open-edit-player-popup-btn", imgSrc: "IMG/edit.png" },
                { class: "open-delete-player-popup-btn", imgSrc: "IMG/delete.png" }
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

    // Gestionnaire d'événement pour le changement de genre de joueur
    $('input[name="player-gender"]').change(function() {
        loadClubs();
    });

    $("#open-add-player-popup-btn").click(function() {
        $("#add-player-popup").show();
    });
      
    // Gestionnaire d'événement pour la soumission du formulaire de joueur
    $('#add-player-btn').click(function() {
        // Récupérer les valeurs des champs
        var playerName = $('#first-name').val();
        var playerLastName = $('#last-name').val();
        var playerGender = $('input[name="player-gender"]:checked').val();
        var playerClub = $('#player-club').val();
        var playerRole = $('#player-role').val();

        // Vérifier si les champs sont remplis
        if (playerName && playerLastName && playerGender && playerClub && playerRole) {
            // Créer un objet joueur
            var player = {
                name: playerName,
                lastName: playerLastName,
                gender: playerGender,
                club: playerClub,
                role: playerRole
            };

            // Enregistrer le joueur dans le sessionStorage
            savePlayer(player);

            // Effacer les champs du formulaire après l'ajout
            $('#first-name').val('');
            $('#last-name').val('');
            $('input[name="player-gender"]').eq(0).prop('checked', true);
            $('#player-club').val('');
            $('#player-role').val('');

            $("#add-player-popup").hide();
        } else {
            alert('Veuillez remplir tous les champs du formulaire.');
        }
    });
    
    $(document).on('click', '.open-see-player-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        var players = JSON.parse(sessionStorage.getItem('players')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var player = players[index];

        $('#see-player-popup #current-player-name').text(player.name + ' ' + player.lastName);
        $('#see-player-popup #current-player-gender').text(player.gender);
        $('#see-player-popup #current-player-club').text(player.club);
        $('#see-player-popup #current-player-role').text(player.role);

        $("#see-player-popup").show();
    });

    $(document).on('click', '.open-edit-player-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#edit-player-popup').attr('data-id', rowId);
        var players = JSON.parse(sessionStorage.getItem('players')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var player = players[index];

        $('#edit-player-popup #new-first-name').val(player.name);
        $('#edit-player-popup #new-last-name').val(player.lastName);
        $('#edit-player-popup input[name="new-player-gender"]').filter('[value="' + player.gender + '"]').prop('checked', true);
        $('#edit-player-popup #new-player-club').val(player.club);
        $('#edit-player-popup #new-player-role').val(player.role);

        $("#edit-player-popup").show();
    });

    $(document).on('click', '#edit-player-btn', function() {
        var rowId = $('#edit-player-popup').attr('data-id');
        var players = JSON.parse(sessionStorage.getItem('players')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var player = players[index];

        var newName = $('#edit-player-popup #new-first-name').val();
        var newLastName = $('#edit-player-popup #new-last-name').val();
        var newGender = $('#edit-player-popup input[name="new-player-gender"]:checked').val();
        var newClub = $('#edit-player-popup #new-player-club').val();
        var newRole = $('#edit-player-popup #new-player-role').val();

        player.name = newName;
        player.lastName = newLastName;
        player.gender = newGender;
        player.club = newClub;
        player.role = newRole;
        players[index] = player;
        sessionStorage.setItem('players', JSON.stringify(players));

        location.reload();
    });

    $(document).on('click', '.open-delete-player-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#delete-player-popup').attr('data-id', rowId);
        $("#delete-player-popup").show();
    });

    $(document).on('click', '#delete-btn', function() {
        var rowId = $('#delete-player-popup').data('id');
        if (rowId) {
            var rowElement = $('#' + rowId);
            removePlayer(rowElement);
        }
        $("#delete-player-popup").hide();
    }); 
   
    $(".close-popup-btn").click(function() {
        $("#add-player-popup").hide();
        $("#see-player-popup").hide();
        $("#edit-player-popup").hide();
        $("#delete-player-popup").hide();
    });
});
