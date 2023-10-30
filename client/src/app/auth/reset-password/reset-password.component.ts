import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    }, {validators: this.matchPasswords});
  }

  matchPasswords(control: AbstractControl): null | object {
    const formGroup = control as FormGroup;
    const passwordControl = formGroup.get('newPassword');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value) {
      return {passwordsDoNotMatch: true};
    }
    return null;
  }

  resetPassword(): void {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;

      this.authService.resetPassword(newPassword, this.token).subscribe(
        success => {
          this.goToLoginPage();
        },
        error => {
          // Gérer l'erreur ici
        }
      );
    } else {
      // Gérer l'erreur ici
    }
  }

  goToLoginPage(): void {
    this.router.navigateByUrl('/auth/login');
  }
}
