var fv;
var select_type;

document.addEventListener('DOMContentLoaded', function(e) {
    const form = document.getElementById('frmForm');
    fv = FormValidation.formValidation(form, {
            locale: "es_ES",
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                icon: new FormValidation.plugins.Icon({
                    valid: "fa fa-check",
                    invalid: "fa fa-times",
                    validating: "fa fa-refresh",
                }),
            },
            fields: {
                name: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 1,
                        },
                        remote: {
                            url: pathname,
                            data: function() {
                                return {
                                    name: form.querySelector('[name="name"]').value,
                                    // marca: form.querySelector('[name="marca"]').value,
                                    // lcd: form.querySelector('[name="lcd"]').value,
                                    // type: form.querySelector('[name="type"]').value,

                                    nmar: form.querySelector('[name="nmar"]').value,
                                    ntic: form.querySelector('[name="ntic"]').value,
                                    ncat: form.querySelector('[name="ncat"]').value,
                                    action: "validate_data",
                                };
                            },
                            message: "El nombre ya se encuentra registrado",
                            method: "POST",
                        },
                    },
                },
                ncat: {
                    validators: {
                        notEmpty: {
                            message: "Seleccione una categoria",
                        },
                    },
                },
                nmar: {
                    validators: {
                        notEmpty: {
                            message: "Seleccione la marca",
                        },
                    },
                },
                ntic: {
                    validators: {
                        notEmpty: {
                            message: "Seleccione el tipo.",
                        },
                    },
                },
                // type: {
                //     validators: {
                //         notEmpty: {
                //             message: "Seleccione una categoria",
                //         },
                //     },
                // },
                // marca: {
                //     validators: {
                //         notEmpty: {
                //             message: "Seleccione la marca",
                //         },
                //     },
                // },
                // lcd: {
                //     validators: {
                //         notEmpty: {
                //             message: "Seleccione el tipo.",
                //         },
                //     },
                // },
                image: {
                    validators: {
                        file: {
                            extension: "jpeg,jpg,png",
                            type: "image/jpeg,image/png",
                            maxFiles: 1,
                            message: "Introduce una imagen v??lida",
                        },
                    },
                },
                price: {
                    validators: {
                        notEmpty: {},
                        numeric: {
                            message: "El valor no es n??mero",
                            thousandsSeparator: "",
                            decimalSeparator: ".",
                        },
                    },
                },
                priced: {
                    validators: {
                        notEmpty: {},
                        numeric: {
                            message: "El valor no es n??mero",
                            thousandsSeparator: "",
                            decimalSeparator: ".",
                        },
                    },
                },
                pricei: {
                    validators: {
                        notEmpty: {},
                        numeric: {
                            message: "El valor no es n??mero",
                            thousandsSeparator: "",
                            decimalSeparator: ".",
                        },
                    },
                },
            },
        })
        .on("core.element.validated", function(e) {
            if (e.valid) {
                const groupEle = FormValidation.utils.closest(
                    e.element,
                    ".form-group"
                );
                if (groupEle) {
                    FormValidation.utils.classSet(groupEle, {
                        "has-success": false,
                    });
                }
                FormValidation.utils.classSet(e.element, {
                    "is-valid": false,
                });
            }
            const iconPlugin = fv.getPlugin("icon");
            const iconElement =
                iconPlugin && iconPlugin.icons.has(e.element) ?
                iconPlugin.icons.get(e.element) :
                null;
            iconElement && (iconElement.style.display = "none");
        })
        .on("core.validator.validated", function(e) {
            if (!e.result.valid) {
                const messages = [].slice.call(
                    form.querySelectorAll(
                        '[data-field="' + e.field + '"][data-validator]'
                    )
                );
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute("data-validator");
                    messageEle.style.display =
                        validator === e.validator ? "block" : "none";
                });
            }
        })
        .on("core.form.valid", function() {
            submit_formdata_with_ajax_form(fv);
        });
});

$(function() {

    $('.select2').select2({
        theme: 'bootstrap4',
        language: "es"
    });

    // select_type = $('select[name="type"]');
    // select_type = $('select[name="marca"]');
    // select_type = $('select[name="lcd"]');

    select_type = $('select[name="ncat"]');
    select_type = $('select[name="nmar"]');
    select_type = $('select[name="ntic"]');
    select_type = $('select[name="name"]');

    select_type.on('change.select2', function() {
        // fv.revalidateField('type');
        // fv.revalidateField('marca');
        // fv.revalidateField('lcd');
        fv.revalidateField('ncat');
        fv.revalidateField('nmar');
        fv.revalidateField('ntic');
        fv.revalidateField('name');

    });

    $('input[name="price"]')
        .TouchSpin({
            min: 0.01,
            max: 10000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            verticalbuttons: true,
            maxboostedstep: 10,
            prefix: "S/",
        })
        .on("change touchspin.on.min touchspin.on.max", function() {
            fv.revalidateField("price");
        })
        .keypress(function(e) {
            return validate_decimals($(this), e);
        });

    $('input[name="priced"]')
        .TouchSpin({
            min: 0.01,
            max: 10000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            verticalbuttons: true,
            maxboostedstep: 10,
            prefix: "S/",
        })
        .on("change touchspin.on.min touchspin.on.max", function() {
            fv.revalidateField("priced");
        })
        .keypress(function(e) {
            return validate_decimals($(this), e);
        });


    $('input[name="pricei"]')
        .TouchSpin({
            min: 0.01,
            max: 10000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            verticalbuttons: true,
            maxboostedstep: 10,
            prefix: "S/",
        })
        .on("change touchspin.on.min touchspin.on.max", function() {
            fv.revalidateField("pricei");
        })
        .keypress(function(e) {
            return validate_decimals($(this), e);
        });
});