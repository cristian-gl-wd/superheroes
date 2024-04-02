import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

export function minArrayLength(min: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control) return null;
    
    const fa = control as FormArray;
    return fa && fa.length >= min ? null : { minArrayLength: { requiredLength: min, actualLength: fa ? fa.length : 0 } };
  };
}
