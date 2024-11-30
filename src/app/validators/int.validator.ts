import { ValidatorFn } from "@angular/forms";

export const intValidator: ValidatorFn = control => {
    control.setValue(control.value.replace(/[^0-9]/g, ''));
    return null;
}