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
import {forkJoin} from "rxjs";

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

  dataSource = new MatTableDataSource<QuizModel>;
  displayedColumns: string[] = ['title', 'image', 'description', 'createdAt', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    console.log(this.dataSource instanceof MatTableDataSource);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    public toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);

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
      this.quizzes = data;
      this.dataSource.data = this.quizzes;
      console.log('quizzes', data)
    });
  }


  // fonction quui renvoie le nombre de quiz
  countQuizzes(): number {
    return this.quizzes.length;
  }

  editQuiz(userId: number): void {
    this.router.navigate(['/edit-quiz', userId]);
  }

  onDeleteQuiz(id: number) {
    this.quizService.deleteQuiz(id).subscribe(
      response => {
        this.quizzes = this.quizzes.filter(quiz => quiz.id !== id);
        this.dataSource = new MatTableDataSource(this.quizzes);
        this.paginator._changePageSize(this.paginator.pageSize);
        console.log('Quiz deleted successfully!');
      },
      error => {
        console.error('There was an error during the deletion:', error);
      }
    );
  }


}
