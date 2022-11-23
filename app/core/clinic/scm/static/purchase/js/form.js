var tblProducts;
var provider = null;
var product;
var fvPurchase;
var fvProvider;
var input_datejoined;
var input_searchprovider;
var current_date;
var purchase = {
    details: {
        provider: '',
        date_joined: '',
        subtotal: 0.00,
        products: [],
    },
    calculate_invoice: function() {
        var subtotal = 0.00;
        $.each(this.details.products, function(i, item) {
            item.pos = i;
            item.cant = parseInt(item.cant);
            item.subtotal = item.cant * parseFloat(item.price);
        });
        this.details.subtotal = subtotal;
    },
    list_products: function() {
        this.calculate_invoice();
        tblProducts = $('#tblProducts').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            data: this.details.products,
            ordering: false,
            lengthChange: false,
            searching: false,
            paginate: false,
            columns: [
                { data: "id" },
                { data: "name" },
                // { data: "type.name" },
                { data: "ncat.nombre" },
                { data: "cant" },
                { data: "price" },
                { data: "subtotal" },
            ],
            columnDefs: [{
                    targets: [-3],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '<input type="text" class="form-control input-sm" autocomplete="off" name="cant" value="' + row.cant + '">';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return 'S/' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return 'S/' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [0],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '<a rel="remove" class="btn btn-danger btn-flat btn-xs"><i class="fa fa-trash fa-1x"></i></a>';
                    }
                },
            ],
            rowCallback: function(row, data, index) {
                var frm = $(row).closest('tr');

                frm.find('input[name="cant"]')
                    .TouchSpin({
                        min: 1,
                        max: 10000000,
                    })
                    .keypress(function(e) {
                        return validate_form_text('numbers', e, null);
                    });
            },
            initComplete: function(settings, json) {

            },
        });
    },
    get_products_ids: function() {
        var ids = [];
        $.each(this.details.products, function(i, item) {
            ids.push(item.id);
        });
        return ids;
    },
    add_product: function(item) {
        this.details.products.push(item);
        this.list_products();
    },
};

document.addEventListener('DOMContentLoaded', function(e) {
    const frmPurchase = document.getElementById('frmPurchase');
    fvPurchase = FormValidation.formValidation(frmPurchase, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                excluded: new FormValidation.plugins.Excluded(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                date_joined: {
                    validators: {
                        notEmpty: {
                            message: 'La fecha es obligatoria'
                        },
                        date: {
                            format: 'YYYY-MM-DD',
                            message: 'La fecha no es válida'
                        }
                    }
                },
            },
        })
        .on('core.element.validated', function(e) {
            if (e.valid) {
                const groupEle = FormValidation.utils.closest(e.element, '.form-group');
                if (groupEle) {
                    FormValidation.utils.classSet(groupEle, {
                        'has-success': false,
                    });
                }
                FormValidation.utils.classSet(e.element, {
                    'is-valid': false,
                });
            }
            const iconPlugin = fvPurchase.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function(e) {
            if (!e.result.valid) {
                const messages = [].slice.call(frmPurchase.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function() {

            if (provider === null) {
                message_error('Debe tener un proveedor seleccionado');
                return false;
            }

            purchase.details.provider = provider.id;
            purchase.details.date_joined = $('input[name="date_joined"]').val();

            if (purchase.details.products.length === 0) {
                message_error('Debe tener al menos un item en el detalle de la compra');
                return false;
            }

            submit_with_ajax('Notificación',
                '¿Estas seguro de realizar la siguiente acción?',
                pathname, {
                    'action': $('input[name="action"]').val(),
                    'items': JSON.stringify(purchase.details)
                },
                function() {
                    location.href = fvPurchase.form.getAttribute('data-url');
                },
            );
        });
});

document.addEventListener('DOMContentLoaded', function(e) {
    const frmProvider = document.getElementById('frmProvider');
    fvProvider = FormValidation.formValidation(frmProvider, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                name: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
                        remote: {
                            url: pathname,
                            data: function() {
                                return {
                                    obj: frmProvider.querySelector('[name="name"]').value,
                                    type: 'name',
                                    action: 'validate_provider'
                                };
                            },
                            message: 'El nombre ya se encuentra registrado',
                            method: 'POST'
                        }
                    }
                },
                ruc: {
                    validators: {
                        notEmpty: {},
                        // stringLength: {
                        //     min: 1,
                        //     max:11,
                        // },
                        digits: {},

                        remote: {
                            url: pathname,
                            data: function() {
                                return {
                                    obj: frmProvider.querySelector('[name="ruc"]').value,
                                    type: 'ruc',
                                    action: 'validate_provider'
                                };
                            },
                            message: 'El número de ruc ya se encuentra registrado',
                            method: 'POST'
                        }
                    }
                },
                mobile: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 10
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            data: function() {
                                return {
                                    obj: frmProvider.querySelector('[name="mobile"]').value,
                                    type: 'mobile',
                                    action: 'validate_provider'
                                };
                            },
                            message: 'El número de teléfono ya se encuentra registrado',
                            method: 'POST'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 5
                        },
                        regexp: {
                            regexp: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i,
                            message: 'El formato email no es correcto'
                        },
                        remote: {
                            url: pathname,
                            data: function() {
                                return {
                                    obj: frmProvider.querySelector('[name="email"]').value,
                                    type: 'email',
                                    action: 'validate_provider'
                                };
                            },
                            message: 'El email ya se encuentra registrado',
                            method: 'POST'
                        }
                    }
                },
                address: {
                    validators: {
                        // stringLength: {
                        //     min: 4,
                        // }
                    }
                }
            },
        })
        .on('core.element.validated', function(e) {
            if (e.valid) {
                const groupEle = FormValidation.utils.closest(e.element, '.form-group');
                if (groupEle) {
                    FormValidation.utils.classSet(groupEle, {
                        'has-success': false,
                    });
                }
                FormValidation.utils.classSet(e.element, {
                    'is-valid': false,
                });
            }
            const iconPlugin = fvProvider.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function(e) {
            if (!e.result.valid) {
                const messages = [].slice.call(frmProvider.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function() {
            var parameters = {};
            $.each($(fvProvider.form).serializeArray(), function(key, item) {
                parameters[item.name] = item.value;
            });
            parameters['action'] = 'create_provider';
            submit_with_ajax('Notificación', '¿Estas seguro de realizar la siguiente acción?', pathname,
                parameters,
                function() {
                    $('#myModalAddProv').modal('hide');
                }
            );
        });
});


function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }

    var option = $(
        '<div class="wrapper container">' +
        '<div class="row">' +
        '<div class="col-lg-1">' +
        '<img src="' +
        repo.image +
        '" class="img-fluid img-thumbnail d-block mx-auto rounded">' +
        "</div>" +
        '<div class="col-lg-11 text-left shadow-sm">' +
        //'<br>' +
        '<p style="margin-bottom: 0;">' +
        "<b>Nombre:</b> " +
        repo.name +
        "<br>" +
        "<b>Producto:</b> " +
        // repo.type.name +
        // "<br>" +
        // "<b>Marca:</b> " +s
        // repo.marca.id +
        // "<br>" +
        // "<b>Calidad:</b> " +
        // repo.lcd.id +
        repo.ncat.nombre +
        "<br>" +
        "<b>Marca:</b> " +
        repo.nmar.nombre +
        "<br>" +
        "<b>Calidad:</b> " +
        repo.ntic.nombre +
        "<br>" +
        '<b>Precio:</b> <span class="badge badge-warning">$' +
        repo.price +
        "</span>" +
        "</p>" +
        "</div>" +
        "</div>" +
        "</div>"
    );

    return option;
}



$(function() {

    current_date = new moment().format("YYYY-MM-DD");
    input_datejoined = $('input[name="date_joined"]');
    input_searchprovider = $('input[name="search_provider"]');

    $('.select2').select2({
        theme: 'bootstrap4',
        language: "es",
    });

    $('.btnRemoveAll').on('click', function() {
        if (purchase.details.products.length === 0) return false;
        dialog_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function() {
            purchase.details.products = [];
            purchase.list_products();
        });
    });

    /* Products */

    // $('input[name="search"]').autocomplete({
    //     source: function (request, response) {
    //         $.ajax({
    //             url: pathname,
    //             data: {
    //                 'action': 'search_products',
    //                 'term': request.term,
    //                 'ids': JSON.stringify(purchase.get_products_ids()),
    //             },
    //             dataType: "json",
    //             type: "POST",
    //             beforeSend: function () {

    //             },
    //             success: function (data) {
    //                 response(data);
    //             }
    //         });
    //     },
    //     min_length: 3,
    //     delay: 300,
    //     select: function (event, ui) {
    //         event.preventDefault();
    //         $(this).blur();
    //         ui.item.cant = 1;
    //         purchase.add_product(ui.item);
    //         $(this).val('').focus();
    //     }
    // });
    $('select[name="search"]')
        .select2({
            theme: "bootstrap4",
            language: "es",
            allowClear: true,
            ajax: {
                delay: 250,
                type: "POST",
                url: window.location.pathname,
                data: function(params) {
                    var queryParameters = {
                        term: params.term,
                        action: "search_products",
                    };
                    return queryParameters;
                },
                processResults: function(data) {
                    return {
                        results: data,
                    };
                },
            },
            placeholder: "Ingrese una descripción",
            minimumInputLength: 1,
            templateResult: formatRepo,
        })
        .on("select2:select", function(e) {
            var data = e.params.data;
            data.cant = 1;
            // data.subtotal = 0.0;
            purchase.add_product(data);
            $(this).val("").trigger("change.select2");
        });

    $('.btnClear').on('click', function() {
        $('input[name="search"]').val('').focus();
    });




    $('#tblProducts tbody')
        .on('change', 'input[name="cant"]', function() {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            purchase.details.products[tr.row].cant = parseInt($(this).val());
            purchase.calculate_invoice();
            $('td:eq(5)', tblProducts.row(tr.row).node()).html('$' + purchase.details.products[tr.row].subtotal.toFixed(2));
        })
        .on('click', 'a[rel="remove"]', function() {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            purchase.details.products.splice(tr.row, 1);
            purchase.list_products();
        });

    $('.btnSearch').on('click', function() {
        tblSearchProd = $('#tblSearchProd').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            ajax: {
                url: pathname,
                type: 'POST',
                data: {
                    'action': 'search_products',
                    'term': $('select[name="search"]').val(),
                    'ids': JSON.stringify(purchase.get_products_ids()),
                },
                dataSrc: ""
            },
            columns: [
                { data: "name" },
                // { data: "type.name" },
                { data: "ncat.nombre" },
                { data: "nmar.nombre" },
                { data: "price" },
                { data: "id" },
            ],
            columnDefs: [{
                    targets: [-2],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return 'S/' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    render: function(data, type, row) {
                        return '<a rel="add" class="btn btn-success btn-flat btn-xs"><i class="fas fa-plus"></i></a>'
                    }
                }
            ],
            rowCallback: function(row, data, index) {

            },
        });
        $('#myModalSearchProd').modal('show');
    });

    $('#tblSearchProd tbody').on('click', 'a[rel="add"]', function() {
        var row = tblSearchProd.row($(this).parents('tr')).data();
        row.cant = 1;
        purchase.add_product(row);
        tblSearchProd.row($(this).parents('tr')).remove().draw();
    });

    /* Provider */

    input_searchprovider.autocomplete({
        source: function(request, response) {
            $.ajax({
                url: pathname,
                data: {
                    action: 'search_provider',
                    term: request.term,
                },
                dataType: "json",
                type: "POST",
                beforeSend: function() {

                },
                success: function(data) {
                    response(data);
                }
            });
        },
        min_length: 3,
        delay: 300,
        select: function(event, ui) {
            event.preventDefault();
            $(this).val(ui.item.name);
            $(this).blur();
            provider = ui.item;
        }
    });

    $('.btnClearProv').on('click', function() {
        provider = null;
        input_searchprovider.val('').focus();
    });

    $('.btnAddProv').on('click', function() {
        $('#myModalAddProv').modal('show');
    });

    $('#myModalAddProv').on('hidden.bs.modal', function() {
        fvProvider.resetForm(true);
    });

    $('input[name="ruc"]').keypress(function(e) {
        return validate_form_text('numbers', e, null);
    });

    $('input[name="mobile"]').keypress(function(e) {
        return validate_form_text('numbers', e, null);
    });

    input_datejoined.datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false,
        locale: 'es',
        orientation: 'bottom',
        keepOpen: false
    });

    input_datejoined.datetimepicker('date', input_datejoined.val());

    input_datejoined.on('change.datetimepicker', function(e) {
        fvPurchase.revalidateField('date_joined');
    });
});