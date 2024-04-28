$(document).ready(function() {
    fillTable();

    var dataTable = $('#stadium-table').DataTable({
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

    // Fonction pour enregistrer un stade dans le sessionStorage
    function saveStadium(stadium) {
        var stadiums = JSON.parse(sessionStorage.getItem('stadiums')) || [];
        stadiums.push(stadium);
        sessionStorage.setItem('stadiums', JSON.stringify(stadiums));
        location.reload();
    }

    function removeStadium(row) {
        var rowId = row.attr('id');
        if (rowId) {
            var index = parseInt(rowId.split('-')[1]);
            if (!isNaN(index)) {
                var stadiums = JSON.parse(sessionStorage.getItem('stadiums')) || [];
                stadiums.splice(index, 1);
                sessionStorage.setItem('stadiums', JSON.stringify(stadiums));
                location.reload();
            }
        }
    }

    function fillTable() {
        var tableBody = $("#stadium-table tbody");
        tableBody.empty();

        var stadiums = JSON.parse(sessionStorage.getItem('stadiums')) || [];

        stadiums.forEach(function(stadium, index) {
            var row = $("<tr>").attr("id", "row-" + index);
            var cells = [stadium.name];

            var buttons = [
                { class: "open-see-stadium-popup-btn", imgSrc: "IMG/see.png" },
                { class: "open-edit-stadium-popup-btn", imgSrc: "IMG/edit.png" },
                { class: "open-delete-stadium-popup-btn", imgSrc: "IMG/delete.png" }
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

    $("#open-add-stadium-popup-btn").click(function() {
        $("#add-stadium-popup").show();
    });

    // Ajouter un stade à la liste et enregistrer dans le sessionStorage
    $('#add-stadium-btn').click(function() {
        var stadiumName = $('#name').val();

        // Vérifier si les champs sont remplis
        if (stadiumName) {
            var stadium = {
                name: stadiumName
            };

            // Ajouter le stade à la liste affichée avec le bouton de suppression
            var stadiumItem = $('<li>').text('Nom : ' + stadiumName);
            $('#stadium-list').append(stadiumItem);

            // Enregistrer le stade dans le sessionStorage
            saveStadium(stadium);

            // Effacer les champs du formulaire
            $('#name').val('');
        } else {
            alert('Veuillez remplir tous les champs du formulaire.');
        }
    });

    $(document).on('click', '.open-see-stadium-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        var stadiums = JSON.parse(sessionStorage.getItem('stadiums')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var stadium = stadiums[index];

        $('#see-stadium-popup #current-stadium-name').text(stadium.name);

        $("#see-stadium-popup").show();
    });

    $(document).on('click', '.open-edit-stadium-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#edit-stadium-popup').attr('data-id', rowId);
        var stadiums = JSON.parse(sessionStorage.getItem('stadiums')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var stadium = stadiums[index];

        $('#edit-stadium-popup #new-stadium-name').val(stadium.name);

        $("#edit-stadium-popup").show();
    });

    $(document).on('click', '#edit-stadium-btn', function() {
        var rowId = $('#edit-stadium-popup').attr('data-id');
        var stadiums = JSON.parse(sessionStorage.getItem('stadiums')) || [];
        var index = parseInt(rowId.split('-')[1]);
        var stadium = stadiums[index];

        var newName = $('#edit-stadium-popup #new-stadium-name').val();

        stadium.name = newName;
        stadiums[index] = stadium;
        sessionStorage.setItem('stadiums', JSON.stringify(stadiums));

        location.reload();
    });

    $(document).on('click', '.open-delete-stadium-popup-btn', function() {
        var rowId = $(this).closest('tr').attr('id');
        $('#delete-stadium-popup').attr('data-id', rowId);
        $("#delete-stadium-popup").show();
    });

    $(document).on('click', '#delete-btn', function() {
        var rowId = $('#delete-stadium-popup').data('id');
        if (rowId) {
            var rowElement = $('#' + rowId);
            removeStadium(rowElement);
        }
        $("#delete-stadium-popup").hide();
    });

    $(".close-popup-btn").click(function() {
        $("#add-stadium-popup").hide();
        $("#see-stadium-popup").hide();
        $("#edit-stadium-popup").hide();
        $("#delete-stadium-popup").hide();
    });
});
