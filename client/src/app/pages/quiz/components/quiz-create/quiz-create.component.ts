import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {QuizService} from "../../../../services/quiz.service";
import {CategoryModel} from "../../../../models/category.model";
import {CategoryService} from "../../../../services/category.service";
import {UserProfileService} from "../../../../services/user-profile-service";
import {User} from "../../../../models/user.model";
import {Router} from "@angular/router";
import {ToastService} from "../../../../services/toastService";
import {hasCorrectAnswerValidator} from "../../../../validators/question.validator";


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
  image: File | null = null;
  previewUrl: any = null;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private userProfileService: UserProfileService,
    private router: Router,
    public toastService: ToastService) {
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
      this.username = user?.username ?? null;
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
      image: null,
      createdByUserId: ['']
    });
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      text: [''],
      answers: this.fb.array([
        this.createAnswer()
      ]),
      // Attach the custom validator to the question FormGroup
    }, {validators: [hasCorrectAnswerValidator()]});
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

// valider les questions
  validateQuestions(questions: any[]): boolean {
    for (let question of questions) {
      const answers = question.answers;
      const hasCorrectAnswer = answers.some((answer: any) => answer.correct);

      if (!hasCorrectAnswer) {
        return false;
      }
    }
    return true;
  }

  removeQuestion(index: number) {
    this.questionsArray.removeAt(index);
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    const questionGroup = this.questionsArray.at(questionIndex) as FormGroup;
    const answersArray = questionGroup.get('answers') as FormArray;
    answersArray.removeAt(answerIndex);
  }


  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const filenameDisplay = document.getElementById('selectedFilename');

    if (filenameDisplay) {
      if (input.files && input.files[0]) {
        filenameDisplay.textContent = input.files[0].name;
      } else {
        filenameDisplay.textContent = 'Aucun fichier sélectionné';
      }
    }
    const file = (event.target as HTMLInputElement).files;
    if (file && file.length) {
      this.image = file[0];
      this.previewImage(this.image);
      // Met à jour le statut de validation pour le champ 'image'.
      this.quizForm.get('image')?.setValue(this.image);
      this.quizForm.get('image')?.updateValueAndValidity();
    }
  }

  previewImage(file: File) {
    // voir la preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    // s'assurer qu'il y a au moins une réponse correcte par question
    const questions = this.quizForm.get('questions')?.value;
    const isValid = this.validateQuestions(questions);

    if (!isValid) {
      this.toastService.showToast('Each question must have at least one correct answer.', 'error');
      return;
    }
    this.quizForm.value.categoryId = +this.quizForm.value.categoryId;
    const formData = new FormData();
    formData.append('title', this.quizForm.value.title);
    formData.append('description', this.quizForm.value.description);
    formData.append('categoryId', this.quizForm.value.categoryId);
    formData.append('createdByUserId', this.quizForm.value.createdByUserId);
    if (this.image) {
      formData.append('image', this.image);
      formData.append('mimeType', this.image.type);
    }
    if (this.quizForm.get('questions')) {
      const questions = this.quizForm.get('questions')?.value;
      formData.append('questions', JSON.stringify(questions));
    }
    for (let [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }


    this.quizService.createQuiz(formData).subscribe(
      data => {
        this.toastService.showToast('L\'enrgistrement de ton quiz est réalisé avec succès', 'success');
        setTimeout(() => {
          if (this.user) this.router.navigate(['/user-detail', this.user.id]);
        }, 2000);
        console.log(data);
      },
      error => {
        if (error) {
          this.toastService.showToast('Une erreur s\'est produite. Veuillez réessayer plus tard.', 'error');
        } else {
          alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
        }
      }
    );
  }
}
