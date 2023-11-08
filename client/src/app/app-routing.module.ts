import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {ResetPasswordComponent} from "./auth/reset-password/reset-password.component";
import {ErrorComponent} from "./pages/error-rediction/error/error.component";
import {UnauthorizedComponent} from "./pages/error-rediction/unauthorized/unauthorized.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'quiz',
    loadChildren: () =>
      import('./pages/quiz/quiz.module').then((m) => m.QuizModule),
  },
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: 'error', component: ErrorComponent},
  {path: '**', redirectTo: '/error', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
