import { ValidatorFn } from "@angular/forms";

export const emailDomainValidator: ValidatorFn = control => {
    const validDomains = ['duocuc.cl', 'duoc.cl']

    const email:string = control.value;
    if (email && email.indexOf('@') !== -1) {
        const [_, domain] = email.split('@');
        if (!validDomains.includes(domain)) {
            return { emailDomain: true }
        } else {
            return null;
        }
    } else {
        return { emailDomain: true }
    }
}