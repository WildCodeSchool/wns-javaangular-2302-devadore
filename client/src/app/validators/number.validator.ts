import { AbstractControl, ValidationErrors } from "@angular/forms";
export function numberValidator(control: AbstractControl): ValidationErrors | null {
  const regex = /^\d+$/; //expression régulière pour matcher les nombres uniquement

  if (control.value === null || control.value === undefined || regex.test(control.value)) {
    return null; // valeur valide
  } else {
    return { invalidNumber: true }; //valeur invalide
  }
}
