import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {QuizService} from '../../../../services/quiz.service';
import {CategoryModel} from '../../../../models/category.model';
import {CategoryService} from '../../../../services/category.service';
import {UserProfileService} from '../../../../services/user-profile-service';
import {User} from '../../../../models/user.model';
import {Router} from '@angular/router';
import {hasCorrectAnswerValidator} from '../../../../validators/question.validator';

@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-create.component.html',
  styleUrls: ['./quiz-create.component.scss'],
})
export class QuizCreateComponent implements OnInit {
  quizForm: FormGroup;
  private formData: FormData;
  categories: CategoryModel[];
  userImage: any;
  user: User | null;
  username: string | null = null;
  image: File | null = null;
  previewUrl: any = null;
  showToast = false;
  toastMessage: string;
  toastType: 'confirm' | 'success' | 'error' | 'warning';
  canShowButton: boolean = false;
  isHovered = false;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private userProfileService: UserProfileService,
    private router: Router
  ) {
    this.quizForm = this.createQuizForm();
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });
    this.userProfileService.getUserImage().subscribe((image) => {
      this.userImage = image;
    });
    this.userProfileService.getUser().subscribe((user) => {
      this.user = user;
      this.username = user?.username ?? null;
    });
  }

  get questionsArray() {
    return this.quizForm.get('questions') as FormArray;
  }

  getAnswersArray(questionCtrl: AbstractControl): AbstractControl[] {
    return (questionCtrl.get('answers') as FormArray).controls;
  }

  createQuizForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      questions: this.fb.array([this.createQuestion()]),
      image: null,
      createdByUserId: [''],
    });
  }

  createQuestion(): FormGroup {
    return this.fb.group(
      {
        text: [''],
        answers: this.fb.array([this.createAnswer()]),
        // Attach the custom validator to the question FormGroup
      },
      {validators: [hasCorrectAnswerValidator()]}
    );
  }

  createAnswer(): FormGroup {
    return this.fb.group({
      text: [''],
      correct: [false],
    });
  }

  addQuestion(): void {
    (this.quizForm.get('questions') as FormArray).push(this.createQuestion());
  }

  addAnswer(questionIndex: number): void {
    const questionsArray = this.quizForm.get('questions') as FormArray;
    (questionsArray.at(questionIndex).get('answers') as FormArray).push(
      this.createAnswer()
    );
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

  validateCategories(): boolean {
    const selectedCategoryId = this.quizForm.get('categoryId')?.value;
    return selectedCategoryId !== null && selectedCategoryId !== '';
  }

  onSubmit(): void {
    // s'assurer qu'il y a au moins une réponse correcte par question
    const questions = this.quizForm.get('questions')?.value;
    const isValid = this.validateQuestions(questions);
    const isValidCategory = this.validateCategories();

    if (!isValid || !isValidCategory) {
      this.toastMessage = 'Votre quiz est incomplet.';
      this.toastType = 'warning';
      this.canShowButton = false;
      this.showToast = true;
      return;
    }

    this.quizForm.value.categoryId = +this.quizForm.value.categoryId;
    this.formData = new FormData();
    this.formData.append('title', this.quizForm.value.title);
    this.formData.append('description', this.quizForm.value.description);
    this.formData.append('categoryId', this.quizForm.value.categoryId);
    this.formData.append(
      'createdByUserId',
      this.quizForm.value.createdByUserId
    );

    if (this.image) {
      this.formData.append('image', this.image);
      this.formData.append('mimeType', this.image.type);
    }

    if (this.quizForm.get('questions')) {
      const questions = this.quizForm.get('questions')?.value;
      this.formData.append('questions', JSON.stringify(questions));
    }

    this.toastMessage = 'Voulez-vous vraiment enregistrer ce quiz?';
    this.toastType = 'confirm';
    this.canShowButton = true;
    this.showToast = true;
  }

  onToastConfirmed() {
    this.canShowButton = false;
    // Une fois que l'utilisateur a confirmé
    this.quizService.createQuiz(this.formData).subscribe(
      () => {
        this.toastMessage =
          "L'enregistrement de ton quiz est réalisé avec succès";
        this.toastType = 'success';
        this.showToast = true;

        setTimeout(() => {
          if (this.user) {
            this.router.navigate(['/user-detail', this.user.id]);
            this.showToast = false;
          }
        }, 2000);
      },
      (error) => {
        if (error) {
          this.toastMessage =
            "Une erreur s'est produite. Veuillez réessayer plus tard.";
          this.toastType = 'error';
          this.showToast = true;
        }
      }
    );
  }

  editUser(userId: number | undefined): void {
    if (userId === undefined) {
      return;
    }
    this.router.navigate(['/user-detail', userId]);
  }
}
