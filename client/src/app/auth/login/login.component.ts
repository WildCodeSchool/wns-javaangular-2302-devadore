import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;
/*  isAdmin: boolean = false;*/

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private http: HttpClient, private router: Router) {
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

    const { username, password } = this.loginForm.value;
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
          console.log('La navigation vers /home s\'est terminée avec succès');
        }).catch((error) => {
          console.error('Erreur de navigation:', error);
        });
      }
    })
  }
  goToRegisterPage() {
    this.router.navigateByUrl('/auth/register');
  }
}
