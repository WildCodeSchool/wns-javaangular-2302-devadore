import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {ToastService} from "../../services/toastService";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private http: HttpClient, private router: Router, public toastService: ToastService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const {username, password} = this.loginForm.value;
    this.authService.authenticateUser(username, password).subscribe({
      next: (response) => {
        console.log('Response:', response);
        localStorage.setItem('jwtToken', response.token);
        console.log('JWT stocké :', localStorage.getItem('jwtToken'));
        localStorage.setItem('refreshToken', response.refreshToken);

        const decodedToken = this.authService.decodeToken(response.token);
        const isAdmin = decodedToken && decodedToken.roles && decodedToken.roles.includes('ADMIN');
        this.authService.setAdminState(isAdmin);

        this.authService.setAuthenticationState(true);
        this.router.navigate(['/home']).then(() => {
        }).catch((error) => {
          this.toastService.showToast('Erreur de navigation', 'error');
        });
      },
      error: (err) => {
        if (err.error.message === 'User not found') {
          this.toastService.showToast('Utilisateur non trouvé', 'error');
        } else {
          this.toastService.showToast('MOT DE PASSE ou NOM D\'UTILISATEUR non valide', 'warning');
        }
      }
    })
  }

  goToRegisterPage() {
    this.router.navigateByUrl('/auth/register');
  }

  goToForgotPasswordPage() {
    this.router.navigateByUrl('/auth/forgot-password');
  }
}
