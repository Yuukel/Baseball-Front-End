$(document).ready(function() {
    fillTable();

    var dataTable = $('#club-table').DataTable({
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
    function saveClub(club) {
        var clubs = JSON.parse(sessionStorage.getItem('clubs')) || [];
        clubs.push(club);
        sessionStorage.setItem('clubs', JSON.stringify(clubs));
        location.reload();
    }

    function removeClub(row) {
        var rowId = row.attr('id');
        if (rowId) {
            var index = parseInt(rowId.split('-')[1]);
            if (!isNaN(index)) {
                var clubs = JSON.parse(sessionStorage.getItem('clubs')) || [];
                clubs.splice(index, 1);
                sessionStorage.setItem('clubs', JSON.stringify(clubs));
                location.reload();
            }
        }
    }

    function fillTable() {
        var tableBody = $("#club-table tbody");
        tableBody.empty();

        var clubs = JSON.parse(sessionStorage.getItem('clubs')) || [];

        clubs.forEach(function(club, index) {
            var row = $("<tr>").attr("id", "row-" + index);
            var cells = [club.name, club.gender, club.country];

            var buttons = [
                { class: "open-see-club-popup-btn", imgSrc: "IMG/see.png" },
                { class: "open-edit-club-popup-btn", imgSrc: "IMG/edit.png" },
                { class: "open-delete-club-popup-btn", imgSrc: "IMG/delete.png" }
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

    $("#open-add-club-popup-btn").click(function() {
        $("#add-club-popup").show();
    });

    $('#add-club-btn').click(function() {
        var clubName = $('#club-name').val();
        var clubGender = $('input[name="gender"]:checked').val();
        var clubCountry = $('#country').val();

        if (clubName && clubGender && clubCountry) {
            var club = {
                name: clubName,
                gender: clubGender,
                country: clubCountry
            };

            saveClub(club);

            $('#club-name').val('');
            $('input[name="gender"]').eq(0).prop('checked', true);
            $('#country').val('France');

            $("#add-club-popup").hide();
        } else {
            alert('Veuillez remplir tous les champs du formulaire.');
        }
    });
    
    $(document).on('click', '.open-see-club-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        var clubs = JSON.parse(sessionStorage.getItem('clubs')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var club = clubs[index];

        $('#see-club-popup #current-club-name').text(club.name);
        $('#see-club-popup #current-club-gender').text(club.gender);
        $('#see-club-popup #current-club-country').text(club.country);

        $("#see-club-popup").show();
    });

    $(document).on('click', '.open-edit-club-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#edit-club-popup').attr('data-id', rowId);
        var clubs = JSON.parse(sessionStorage.getItem('clubs')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var club = clubs[index];

        $('#edit-club-popup #new-club-name').val(club.name);
        $('#edit-club-popup input[name="new-gender"]').filter('[value="' + club.gender + '"]').prop('checked', true);
        $('#edit-club-popup #new-country').val(club.country);

        $("#edit-club-popup").show();
    });

    $(document).on('click', '#edit-club-btn', function() {
        var rowId = $('#edit-club-popup').attr('data-id');
        var clubs = JSON.parse(sessionStorage.getItem('clubs')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var club = clubs[index];

        var newName = $('#edit-club-popup #new-club-name').val();
        var newGender = $('#edit-club-popup input[name="new-gender"]:checked').val();
        var newCountry = $('#edit-club-popup #new-country').val();

        club.name = newName;
        club.gender = newGender;
        club.country = newCountry;
        clubs[index] = club;
        sessionStorage.setItem('clubs', JSON.stringify(clubs));

        location.reload();
    });

    $(document).on('click', '.open-delete-club-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#delete-club-popup').attr('data-id', rowId);
        $("#delete-club-popup").show();
    });

    $(document).on('click', '#delete-btn', function() {
        var rowId = $('#delete-club-popup').data('id');
        if (rowId) {
            var rowElement = $('#' + rowId);
            removeClub(rowElement);
        }
        $("#delete-club-popup").hide();
    });

    $(".close-popup-btn").click(function() {
        $("#add-club-popup").hide();
        $("#see-club-popup").hide();
        $("#edit-club-popup").hide();
        $("#delete-club-popup").hide();
    });
});
