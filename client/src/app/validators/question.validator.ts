import {AbstractControl, ValidatorFn, FormArray} from '@angular/forms';

export function hasCorrectAnswerValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const answers = control.get('answers') as FormArray;

    if (!answers) {
      return null;
    }

    const hasCorrectAnswer = answers.controls.some(answerControl => answerControl.get('correct')?.value);

    return hasCorrectAnswer ? null : {'noCorrectAnswer': true};
  };
}
