import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {QuizService} from "../../../../services/quiz.service";
import {CategoryModel} from "../../../../models/category.model";
import {CategoryService} from "../../../../services/category.service";
import {UserProfileService} from "../../../../services/user-profile-service";
import {User} from "../../../../models/user.model";


@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-create.component.html',
  styleUrls: ['./quiz-create.component.scss']
})
export class QuizCreateComponent implements OnInit {
  quizForm: FormGroup;
  categories: CategoryModel[];
  userImage: any;
  user: User | null;
  username: string | null = null;

  constructor(private fb: FormBuilder, private quizService: QuizService, private categoryService: CategoryService, private userProfileService: UserProfileService) {
    this.quizForm = this.createQuizForm();
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
    });
    this.userProfileService.getUserImage().subscribe(image => {
      this.userImage = image;
    });
    this.userProfileService.getUser().subscribe(user => {
      this.user = user;
      this.username = user?.username || null;
    });
  }


  get questionsArray() {
    return (this.quizForm.get('questions') as FormArray);
  }

  getAnswersArray(questionCtrl: AbstractControl): AbstractControl[] {
    return (questionCtrl.get('answers') as FormArray).controls;
  }

  createQuizForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      questions: this.fb.array([
        this.createQuestion()
      ]),
      createdByUserId: ['']
    });
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      text: [''],
      answers: this.fb.array([
        this.createAnswer()
      ])
    });
  }

  createAnswer(): FormGroup {
    return this.fb.group({
      text: [''],
      correct: [false]
    });
  }

  addQuestion(): void {
    (this.quizForm.get('questions') as FormArray).push(this.createQuestion());
  }

  addAnswer(questionIndex: number): void {
    const questionsArray = (this.quizForm.get('questions') as FormArray);
    (questionsArray.at(questionIndex).get('answers') as FormArray).push(this.createAnswer());
  }

  removeQuestion(index: number) {
    this.questionsArray.removeAt(index);
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    const questionGroup = this.questionsArray.at(questionIndex) as FormGroup;
    const answersArray = questionGroup.get('answers') as FormArray;
    answersArray.removeAt(answerIndex);
  }

  onSubmit(): void {
    this.quizForm.value.categoryId = +this.quizForm.value.categoryId;
    this.quizForm.value.createdByUserId = +this.quizForm.value.createdByUserId;
    /*    console.log(typeof this.quizForm.value.categoryId);
        console.log(typeof this.quizForm.value.createdByUserId);
        console.log('Submitting the following data:', this.quizForm.value);*/

    this.quizService.createQuiz(this.quizForm.value).subscribe(
      data => {
        console.log('Quiz created successfully!', data);
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }
}
