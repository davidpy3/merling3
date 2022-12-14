var fv;
var input_birthdate;
var date_current;
// var select_parish;

document.addEventListener('DOMContentLoaded', function(event) {
    const form = document.getElementById('frmForm');
    const submitButton = form.querySelector('[type="submit"]');
    fv = FormValidation.formValidation(form, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                first_name: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
                        // regexp: {
                        //     regexp: /^([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\']+[\s])+([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])+?$/i,
                        //     message: 'Debe ingresar sus dos nombres y solo utilizando caracteres alfabéticos'
                        // },
                    }
                },
                last_name: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
                        regexp: {
                            regexp: /^([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\']+[\s])+([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])+?$/i,
                            message: 'Debe ingresar sus dos apellidos y solo utilizando caracteres alfabéticos'
                        },
                    }
                },
                dni: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 1,
                            max: 8
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            // Send { username: 'its value', email: 'its value' } to the back-end
                            data: function() {
                                return {
                                    obj: form.querySelector('[name="dni"]').value,
                                    type: 'dni',
                                    action: 'validate_data'
                                };
                            },
                            message: 'El número de cedula ya se encuentra registrado',
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
                            message: 'El formato del email no es correcto'
                        },
                        remote: {
                            url: pathname,
                            // Send { username: 'its value', email: 'its value' } to the back-end
                            data: function() {
                                return {
                                    obj: form.querySelector('[name="email"]').value,
                                    type: 'email',
                                    action: 'validate_data'
                                };
                            },
                            message: 'El email ya se encuentra registrado',
                            method: 'POST'
                        }
                    }
                },
                image: {
                    validators: {
                        file: {
                            extension: 'jpeg,jpg,png',
                            type: 'image/jpeg,image/png',
                            maxFiles: 1,
                            message: 'Introduce una imagen válida'
                        }
                    }
                },
                groups: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione un perfil'
                        }
                    }
                },
                gender: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione un nivel',
                        },
                    }
                },
                mobile_phone: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 1,
                            // max: 9,
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            // Send { username: 'its value', email: 'its value' } to the back-end
                            data: function() {
                                return {
                                    obj: form.querySelector('[name="mobile_phone"]').value,
                                    type: 'mobile_phone',
                                    action: 'validate_data'
                                };
                            },
                            message: 'El número de teléfono celular ya se encuentra registrado',
                            method: 'POST'
                        }
                    }
                },
                landline: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 1,
                            // max: 6,
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            // Send { username: 'its value', email: 'its value' } to the back-end
                            data: function() {
                                return {
                                    obj: form.querySelector('[name="mobile_phone"]').value,
                                    type: 'landline',
                                    action: 'validate_data'
                                };
                            },
                            message: 'El número de teléfono convencional ya se encuentra registrado',
                            method: 'POST'
                        }
                    }
                },
                address: {
                    validators: {
                        notEmpty: {},
                        // stringLength: {
                        //     min: 4,
                        // }
                    }
                },
                birthdate: {
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
                // parish: {
                //     validators: {
                //         notEmpty: {
                //             message: 'Seleccione una parroquia',
                //         },
                //     }
                // },
                password: {
                    validators: {
                        notEmpty: {
                            message: 'Se requiere la contraseña'
                        }
                    }
                },
            }
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
            const iconPlugin = fv.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function(e) {
            if (!e.result.valid) {
                const messages = [].slice.call(form.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function() {
            submit_formdata_with_ajax_form(fv);
        });
});

$(function() {

    input_birthdate = $('input[name="birthdate"]');
    date_current = new moment().format("YYYY-MM-DD");
    // select_parish = $('select[name="parish"]');

    input_birthdate.datetimepicker({
        format: 'YYYY-MM-DD',
        locale: 'es',
        keepOpen: false,
        defaultDate: date_current,
        maxDate: date_current
    });

    input_birthdate.datetimepicker('date', input_birthdate.val());

    input_birthdate.on('change.datetimepicker', function(e) {
        fv.revalidateField('birthdate');
    });

    $('input[name="dni"]').keypress(function(e) {
        return validate_form_text('numbers', e, null);
    });

    $('input[name="first_name"]').keypress(function(e) {
        return validate_form_text('letters', e, null);
    });

    $('input[name="last_name"]').keypress(function(e) {
        return validate_form_text('letters', e, null);
    });

    $('input[name="mobile_phone"]').keypress(function(e) {
        return validate_form_text('numbers', e, null);
    });

    $('input[name="landline"]').keypress(function(e) {
        return validate_form_text('numbers', e, null);
    });

    $('.select2:not(select[name="groups"])').select2({
        theme: 'bootstrap4',
        language: "es"
    });

    $('select[name="groups"]').select2({
        placeholder: 'Buscar..',
        language: 'es',
        theme: 'bootstrap4',
        allowClear: true
    }).on('change.select2', function(e) {
        fv.revalidateField('groups');
    });

    $('select[name="gender"]').on('change.select2', function() {
        fv.revalidateField('gender');
    });

    // select_parish.select2({
    //     theme: "bootstrap4",
    //     language: 'es',
    //     allowClear: true,
    //     ajax: {
    //         delay: 250,
    //         type: 'POST',
    //         url: window.location.pathname,
    //         data: function (params) {
    //             var queryParameters = {
    //                 term: params.term,
    //                 action: 'search_parish'
    //             }
    //             return queryParameters;
    //         },
    //         processResults: function (data) {
    //             return {
    //                 results: data
    //             };
    //         },
    //     },
    //     placeholder: 'Ingrese una descripción',
    //     minimumInputLength: 1,
    // })
    //     .on('select2:select', function (e) {
    //         console.log(e.params.data);
    //         fv.revalidateField('parish');
    //     })
    //     .on('select2:clear', function (e) {
    //         fv.revalidateField('parish');
    //     });
});