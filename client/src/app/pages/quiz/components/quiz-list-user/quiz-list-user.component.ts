import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Role} from "../../../../models/role.model";
import {User} from "../../../../models/user.model";
import {QuizModel} from "../../../../models/quiz.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AuthService} from "../../../../services/auth.service";
import {UserService} from "../../../../services/user.service";
import {QuizService} from "../../../../services/quiz.service";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, map} from "rxjs";
import {CategoryService} from "../../../../services/category.service";

@Component({
  selector: 'app-quiz-list-user',
  templateUrl: './quiz-list-user.component.html',
  styleUrls: ['./quiz-list-user.component.scss']
})
export class QuizListUserComponent implements OnInit, AfterViewInit {

  allRoles!: Role[];
  userRoles!: Role[];
  isAdmin: boolean = false;
  isUser: boolean = false;
  user = {} as User;
  quizzes: QuizModel[] = [];
  showToast = false;
  toastMessage: string;
  toastType: 'confirm' | 'success' | 'error' | 'warning';
  canShowButton: boolean = false;
  selectedQuizId: number | null = null;

  dataSource = new MatTableDataSource<QuizModel>;
  displayedColumns: string[] = ['category', 'title', 'image', 'description', 'createdAt', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);
    this.dataSource.sortingDataAccessor = (item: QuizModel, property: string) => {
      switch (property) {
        case 'category':
          return item.categoryName;
        case 'title':
          return item.title;
        default:
          return '';
      }
    };

    forkJoin([this.userService.getAllRoles(), this.userService.getUserById(id)])
      .subscribe(([roles, user]) => {
        this.allRoles = roles;
        this.user = user;
        this.userRoles = user.roles;
      });
    this.authService.checkAdminStatus();
    this.authService.isAdmin$.subscribe((isAdminValue) => {
      this.isAdmin = isAdminValue;
    });
    this.authService.checkUserStatus();
    this.authService.isUser$.subscribe((isUserValue) => {
      this.isUser = isUserValue;
    });
    this.quizService.getAllQuizzesCreatedByUser(id).subscribe(data => {
      const observables = data.map(quiz =>
        this.categoryService.getCategoryById(quiz.categoryId).pipe(
          map(category => {
            quiz.categoryName = category.name;
            return quiz;
          })
        )
      );

      forkJoin(observables).subscribe(completedQuizzes => {
        this.quizzes = completedQuizzes;
        this.dataSource.data = this.quizzes;
      });
    });


  }

  countQuizzes(): number {
    return this.quizzes.length;
  }

  editQuiz(userId: number): void {
    this.router.navigate(['/edit-quiz', userId]);
  }

  onDeleteQuiz(id: number) {
    const quizToDelete = this.quizzes.find(quiz => quiz.id === id);
    this.toastMessage = `Êtes-vous sûr de vouloir supprimer le quiz "${quizToDelete?.title}" ?`;
    this.toastType = 'confirm';
    this.showToast = true;
    this.canShowButton = true;
    this.selectedQuizId = id;
    this.ngAfterViewInit()
  }

  onToastConfirmed() {
    if (this.selectedQuizId !== null) {
      this.quizService.deleteQuiz(this.selectedQuizId).subscribe(
        () => {
          this.quizzes = this.quizzes.filter(quiz => quiz.id !== this.selectedQuizId);
          this.dataSource.data = this.quizzes;
          if (this.paginator && this.quizzes.length <= this.paginator.pageSize) {
            this.paginator.previousPage();
          }
          this.showToast = false;
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

  editUser(userId: number | undefined): void {
    if (userId === undefined) {
      return;
    }
    this.router.navigate(['/user-detail', userId]);
  }

}
