$(document).ready(function() {
    loadClubs(); // Charger les équipes enregistrées depuis le sessionStorage au chargement de la page
    loadReferees();
    loadStadiums();
    fillTable();

    var dataTable = $('#match-table').DataTable({
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
    function saveMatch(match) {
        var matchs = JSON.parse(sessionStorage.getItem('matchs')) || [];
        matchs.push(match);
        sessionStorage.setItem('matchs', JSON.stringify(matchs));
        location.reload();
    }

    function removeMatch(row) {
        var rowId = row.attr('id');
        if (rowId) {
            var index = parseInt(rowId.split('-')[1]);
            if (!isNaN(index)) {
                var matchs = JSON.parse(sessionStorage.getItem('matchs')) || [];
                matchs.splice(index, 1);
                sessionStorage.setItem('matchs', JSON.stringify(matchs));
                location.reload();
            }
        }
    }

    // Charger les équipes depuis le sessionStorage et les afficher dans le menu déroulant
    function loadClubs() {
        var clubs = JSON.parse(sessionStorage.getItem('clubs')) || [];
        var selectedGender = $('input[name="match-type"]:checked').val();
        var dropdownMenu1 = $('.match-club1');
        var dropdownMenu2 = $('.match-club2');
        
        dropdownMenu1.empty(); // Vider le menu déroulant avant d'ajouter de nouvelles équipes
        dropdownMenu2.empty(); // Vider le menu déroulant avant d'ajouter de nouvelles équipes
    
        clubs.forEach(function(club) {
            if (club.gender === selectedGender) {
                dropdownMenu1.append($('<option>').val(club.name).text(club.name));
                dropdownMenu2.append($('<option>').val(club.name).text(club.name));
            }
        });
    }

    function loadReferees() {
        var referees = JSON.parse(sessionStorage.getItem('referees')) || [];
        var dropdownMenu = $('.match-referee');
        dropdownMenu.empty(); // Vider le menu déroulant avant d'ajouter de nouvelles équipes
    
        referees.forEach(function(referee) {
            dropdownMenu.append($('<option>').val(referee.name + ' ' + referee.lastName).text(referee.name + ' ' + referee.lastName));
        });
    }

    function loadStadiums() {
        var stadiums = JSON.parse(sessionStorage.getItem('stadiums')) || [];
        var dropdownMenu = $('.match-stadium');
        dropdownMenu.empty(); // Vider le menu déroulant avant d'ajouter de nouvelles équipes
    
        stadiums.forEach(function(stadium) {
            dropdownMenu.append($('<option>').val(stadium.name).text(stadium.name));
        });
    }

    function fillTable() {
        var tableBody = $("#match-table tbody");
        tableBody.empty();

        var matchs = JSON.parse(sessionStorage.getItem('matchs')) || [];

        matchs.forEach(function(match, index) {
            var row = $("<tr>").attr("id", "row-" + index);
            var cells = [match.type, match.club1, match.club2, match.referee, match.stadium, match.date];

            var buttons = [
                { class: "open-see-match-popup-btn", imgSrc: "IMG/see.png" },
                { class: "open-edit-match-popup-btn", imgSrc: "IMG/edit.png" },
                { class: "open-delete-match-popup-btn", imgSrc: "IMG/delete.png" }
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
    $('input[name="match-type"]').change(function() {
        loadClubs();
    });

    $("#open-add-match-popup-btn").click(function() {
        $("#add-match-popup").show();
    });

    // Gestionnaire d'événement pour la soumission du formulaire de joueur
    $('#add-match-btn').click(function() {
        // Récupérer les valeurs des champs
        var matchType = $('input[name="match-type"]:checked').val();
        var matchClub1 = $('#match-club1').val();
        var matchClub2 = $('#match-club2').val();
        var matchReferee = $('#match-referee').val();
        var matchStadium = $('#match-stadium').val();
        var matchDate = $('#match-date').val();

        if(matchClub1 === matchClub2){
            alert("Un club ne peut pas s'affronter lui-même.");
        } else{
            // Vérifier si les champs sont remplis
            if (matchType && matchClub1 && matchClub2 && matchReferee && matchStadium && matchDate) {
                // Créer un objet joueur
                var match = {
                    type: matchType,
                    club1: matchClub1,
                    club2: matchClub2,
                    referee: matchReferee,
                    stadium: matchStadium,
                    date: matchDate
                };
    
                // Enregistrer le joueur dans le sessionStorage
                saveMatch(match);
    
                // Effacer les champs du formulaire après l'ajout
                $('#match-club1').val('');
                $('#match-club2').val('');
                $('#match-referee').val('');
                $('#match-stadium').val('');
                $('#match-date').val('');
            } else {
                alert('Veuillez remplir tous les champs du formulaire.');
            }
        }
    });

    $(document).on('click', '.open-see-match-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        var matchs = JSON.parse(sessionStorage.getItem('matchs')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var match = matchs[index];

        $('#see-match-popup #current-match-type').text(match.type);
        $('#see-match-popup #current-match-club1').text(match.club1);
        $('#see-match-popup #current-match-club2').text(match.club2);
        $('#see-match-popup #current-match-referee').text(match.referee);
        $('#see-match-popup #current-match-stadium').text(match.stadium);
        $('#see-match-popup #current-match-date').text(match.date);

        $("#see-match-popup").show();
    });

    $(document).on('click', '.open-edit-match-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#edit-match-popup').attr('data-id', rowId);
        var matchs = JSON.parse(sessionStorage.getItem('matchs')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var match = matchs[index];

        $('#edit-match-popup #new-match-type').filter('[value="' + match.type + '"]').prop('checked', true);
        $('#edit-match-popup #new-match-club1').val(match.club1);
        $('#edit-match-popup #new-match-club2').val(match.club2);
        $('#edit-match-popup #new-match-referee').val(match.referee);
        $('#edit-match-popup #new-match-stadium').val(match.stadium);
        $('#edit-match-popup #new-match-date').val(match.date);

        $("#edit-match-popup").show();
    });

    $(document).on('click', '#edit-match-btn', function() {
        var rowId = $('#edit-match-popup').attr('data-id');
        var matchs = JSON.parse(sessionStorage.getItem('matchs')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var match = matchs[index];

        var newType = $('#edit-match-popup input[name="new-match-type"]:checked').val();
        var newClub1 = $('#edit-match-popup #new-match-club1').val();
        var newClub2 = $('#edit-match-popup #new-match-club2').val();
        var newReferee = $('#edit-match-popup #new-match-referee').val();
        var newStadium = $('#edit-match-popup #new-match-stadium').val();
        var newDate = $('#edit-match-popup #new-match-date').val();

        if(newClub1 === newClub2){
            alert("Un club ne peut pas s'affronter lui-même.");
        } else{
            match.type = newType;
            match.club1 = newClub1;
            match.club2 = newClub2;
            match.referee = newReferee;
            match.stadium = newStadium;
            match.date = newDate;
            matchs[index] = match;
            sessionStorage.setItem('matchs', JSON.stringify(matchs));
    
            location.reload();
        }
    });

    $(document).on('click', '.open-delete-match-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#delete-match-popup').attr('data-id', rowId);
        $("#delete-match-popup").show();
    });

    $(document).on('click', '#delete-btn', function() {
        var rowId = $('#delete-match-popup').data('id');
        if (rowId) {
            var rowElement = $('#' + rowId);
            removeMatch(rowElement);
        }
        $("#delete-match-popup").hide();
    });

    $(".close-popup-btn").click(function() {
        $("#add-match-popup").hide();
        $("#see-match-popup").hide();
        $("#edit-match-popup").hide();
        $("#delete-match-popup").hide();
    });
});
