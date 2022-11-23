var tblCatP;
var select_cat;

function getData() {
    var parameters = {
        'action': 'search_cat',
        'categorias': select_cat.val(),
    };

    tblCatP = $('#data').DataTable({
        responsive: true,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        ajax: {
            url: pathname,
            type: 'POST',
            data: parameters,
            dataSrc: ""
        },
        columns: [
            { data: "categorias.full_name" },
            { data: "name" },
            { data: "desc" },
            { data: "nmar.nombre" },
            { data: "ntic.nombre" },
            { data: "price" },
            { data: "priced" },
            { data: "pricei" },
            // { data: "stock" },
        ],
        columnDefs: [{
            targets: [-1],
            class: 'text-center',
            render: function(data, type, row) {
                return '$' + parseFloat(data).toFixed(2);
            }
        }, ],
        rowCallback: function(row, data, index) {

        },
        initComplete: function(settings, json) {
            $('[data-toggle="tooltip"]').tooltip();
        }
    });
}

$(function() {

    select_cat = $('select[name="cat"]');

    select_cat.on('change.select2', function() {
        getData();
    });

    $('#data tbody')
        .on('click', 'a[rel="det"]', function() {
            $('.tooltip').remove();
            var cell = tblCatP.cell($(this).closest('td, li')).index();
            var data = tblCatP.row(cell.row).data();

        });
});