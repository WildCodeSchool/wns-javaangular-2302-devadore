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
import {ToastService} from "../../../../services/toastService";
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
  toastMessage = '';
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
    public toastService: ToastService
  ) {
  }

  ngAfterViewInit() {
    console.log(this.dataSource instanceof MatTableDataSource);
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
        console.log(user);
      });
    this.authService.checkAdminStatus();
    this.authService.isAdmin$.subscribe((isAdminValue) => {
      this.isAdmin = isAdminValue;
      console.log('isAdminValue', isAdminValue)
    });
    this.authService.checkUserStatus();
    this.authService.isUser$.subscribe((isUserValue) => {
      this.isUser = isUserValue;
      console.log('isUserValue', isUserValue)
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
    this.showToast = true;
    this.selectedQuizId = id;
  }

  onToastConfirm() {
    if (this.selectedQuizId !== null) {
      this.quizService.deleteQuiz(this.selectedQuizId).subscribe(
        response => {
          this.quizzes = this.quizzes.filter(quiz => quiz.id !== this.selectedQuizId);
          this.dataSource = new MatTableDataSource(this.quizzes);
          this.paginator._changePageSize(this.paginator.pageSize);
          console.log('Quiz supprimé avec succès!');
          this.showToast = false; // Hide the toast after deletion
        },
        error => {
          console.error('Une erreur s\'est produite lors de la suppression :', error);
          this.showToast = false; // Optionally hide the toast on error as well
        }
      );
    }
  }

  onToastCancel() {
    this.showToast = false; // Hide the toast when user cancels
    this.selectedQuizId = null; // Reset the selected quiz id
  }


}
