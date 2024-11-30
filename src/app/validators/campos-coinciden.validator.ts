import { FormControl, ValidatorFn } from "@angular/forms";

export function camposCoincidenValidator(campo: FormControl): ValidatorFn {
    return (control) => {
        const pass1 = control.value;
        const pass2 = campo.value;

        if (pass1 !== pass2) {
            return { noIguales: true };
        } else {
            return null;
        }
    }
}