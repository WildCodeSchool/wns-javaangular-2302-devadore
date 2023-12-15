import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { emailValidator } from '../../validators/email.validator';
import { passwordValidator } from '../../validators/password.validator';
import { debounceTime, map, Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, passwordValidator]],
    confirmPassword: ['', [Validators.required, passwordValidator]],
    email: ['', [Validators.required, emailValidator]],
    image: [null, Validators.required],
  }, {validator: this.matchPasswords});
  image: File | null = null;
  previewUrl: any = null;
  showToast = false;
  toastMessage: string;
  toastType: 'confirm' | 'success' | 'error' | 'warning';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {
    this.registerForm.get('username')!.setAsyncValidators(this.usernameValidator.bind(this));
    this.registerForm.get('email')!.setAsyncValidators(this.emailValidator.bind(this));
  }

  get passwordErrors() {
    const password = this.registerForm.get('password')?.value;
    return {
      isLongEnough: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasSpecialChar: /[^\w\s]/.test(password),
      hasNumber: /\d/.test(password)
    };
  }

  usernameValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.userService.checkUsernameExistence(control.value).pipe(
      debounceTime(300),
      map(res => {
        const error = res ? {usernameExists: true} : null;
        return error;
      })
    );
  }

  emailValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.userService.checkMailExistence(control.value).pipe(
      debounceTime(300),
      map(res => {
        const error = res ? {emailExists: true} : null;
        return error;
      })
    );
  }

  matchPasswords(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (
      passwordControl && confirmPasswordControl &&
      passwordControl.value !== confirmPasswordControl.value
    ) {
      confirmPasswordControl.setErrors({matchPasswords: true});
    } else {
      confirmPasswordControl!.setErrors(null);
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const filenameDisplay = document.getElementById('selectedFilename');

    if (filenameDisplay) {
      if (input.files && input.files[0]) {
        filenameDisplay.textContent = input.files[0].name;
      } else {
        filenameDisplay.textContent = 'Aucun fichier sélectionné';
      }
    }
    const file = (event.target as HTMLInputElement).files;
    if (file?.length) {
      this.image = file[0];
      this.previewImage(this.image);
      // Mettre à jour le statut de validation pour le champ 'image'.
      this.registerForm.get('image')?.setValue(this.image);
      this.registerForm.get('image')?.updateValueAndValidity();
    }
  }

  previewImage(file: File) {
    // voir la preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  registerUser() {
    const formData = new FormData();
    formData.append('username', this.registerForm.get('username')?.value);
    formData.append('password', this.registerForm.get('password')?.value);
    formData.append('email', this.registerForm.get('email')?.value);
    if (this.image) {
      formData.append('image', this.image);
      formData.append('mimeType', this.image.type);
    }
    if (this.registerForm.invalid) {
      return;
    }
    this.userService.register(formData).subscribe(
      response => {
        this.toastMessage = 'L\'enregistrement est réalisé avec succès';
        this.toastType = 'success';
        this.showToast = true;

        setTimeout(() => {
          this.router.navigate(['/home']);
          this.showToast = false;
        }, 2000);

      },
      error => {
        if (error) {
          this.toastMessage = 'Une erreur s\'est produite. Veuillez réessayer plus tard.';
          this.toastType = 'error';
          this.showToast = true;
        }
      }
    );
  }
}
