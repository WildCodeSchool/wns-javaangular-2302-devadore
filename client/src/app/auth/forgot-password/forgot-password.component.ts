import {Component, NgZone, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {debounceTime, map, Observable} from "rxjs";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  showToast = false;
  toastMessage: string;
  toastType: 'confirm' | 'success' | 'error' | 'warning';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email],
        this.emailValidator.bind(this)]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      if (this.forgotPasswordForm.hasError('emailNotExists', 'email')) {
        // Le gestionnaire spécifique lorsque l'email n'existe pas.
        this.toastMessage = "L'adresse e-mail saisie n'existe pas.";
        this.toastType = 'error';
        this.showToast = true;
      } else {
        // Pour toutes les autres erreurs de validation.
        this.toastMessage = 'Veuillez remplir le formulaire correctement.';
        this.toastType = 'error';
        this.showToast = true;
      }
      return;

    }

    const email = this.forgotPasswordForm.get('email')?.value ?? '';
    this.isLoading = true;
    this.authService.forgotPassword(email).subscribe(
      (response: any) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.toastMessage = response.message;
          this.toastType = 'success';
          this.showToast = true;

          setTimeout(() => {
            this.router.navigate(['/home']);
            this.showToast = false;
          }, 4000);
        });
      },
      error => {
        this.ngZone.run(() => {
          this.isLoading = false;
          console.error("Erreur lors de l'envoi du mot de passe oublié:", error);
          this.toastMessage = 'Une erreur s\'est produite. Veuillez réessayer plus tard.';
          this.toastType = 'error';
          this.showToast = true;
        });
      }
    );
  }

  emailValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.userService.checkMailExistence(control.value).pipe(
      debounceTime(300),
      map(res => {
        // L'e-mail doit exister pour la réinitialisation du mot de passe, donc si `res` est true, il n'y a pas d'erreur.
        // Si `res` est false, alors l'e-mail n'existe pas et vous retournez l'erreur correspondante.
        return res ? null : {emailNotExists: true};
      })
    );
  }

}
