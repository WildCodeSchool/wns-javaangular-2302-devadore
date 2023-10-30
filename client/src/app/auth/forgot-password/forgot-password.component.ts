import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

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

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.get('email')?.value ?? '';
    this.isLoading = true;
    this.authService.forgotPassword(email).subscribe(
      (response: any) => {  // Notez l'ajout du type "any" ici pour faciliter l'accès à la propriété "message"
        this.ngZone.run(() => {
          this.isLoading = false;
          console.log(response);
          // Utilisez la réponse pour extraire le message et l'afficher
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


}
