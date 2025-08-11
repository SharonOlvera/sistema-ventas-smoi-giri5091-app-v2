import { Injectable } from "@angular/core";
import { AbstractControl, MinLengthValidator } from "@angular/forms";

@Injectable({ providedIn: 'root'})
export class BaseForm {

    constructor() {}

    isInvalidField(form: AbstractControl | null): boolean {
        var bandera = false;
        if (form) {
            bandera = form.touched || form.dirty && form.invalid;
        }
        return bandera;
    }

    getErrorMessage(form: AbstractControl | null) {
        let message = '';

        if (form) {
            const { errors } = form;

            if (errors) {
                const messages: any = {
                    required: 'Este campo es requerido',
                    email: 'Este correo electrónico es inválido',
                    pattern: 'Formato inválido',
                    min: 'El rango es muy corto',
                    max: 'El rango es muy largo',
                    minlength: "Pocos caracteres"
                }

                const errorKey = Object.keys(errors).find(Boolean)
                if (errorKey) message = messages[errorKey];
            }
        }
        return message;
    }
}