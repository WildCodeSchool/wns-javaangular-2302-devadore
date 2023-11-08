import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {catchError, map, Observable, of} from 'rxjs';
import {QuizService} from "./quiz.service";

@Injectable({
  providedIn: 'root'
})
export class EditQuizGuard implements CanActivate {
  constructor(
    private quizService: QuizService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const quizId = route.params['id'];
    console.log(quizId)

    if (!quizId) {
      this.router.navigate(['/error']);
      return of(false);
    }

    return this.quizService.canUserEditQuiz(quizId).pipe(
      map(canEdit => {
        if (!canEdit) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      }),
      catchError((error) => {
        console.error('Error checking quiz editing permissions', error);
        this.router.navigate(['/error']);
        return of(false);
      })
    );
  }
}
