import {Component, OnInit} from '@angular/core';

import {FormGroup, FormBuilder, Validators, FormArray, AbstractControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {QuizService} from "../../../../services/quiz.service";
import {CategoryService} from "../../../../services/category.service";
import {UserProfileService} from "../../../../services/user-profile-service";
import {CategoryModel} from "../../../../models/category.model";
import {User} from "../../../../models/user.model";
import {hasCorrectAnswerValidator} from "../../../../validators/question.validator";
import {tap} from "rxjs/operators";
import {ToastService} from "../../../../services/toastService";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  selector: 'app-quiz-edit',
  templateUrl: './quiz-edit.component.html',
  styleUrls: ['./quiz-edit.component.scss']
})
export class QuizEditComponent implements OnInit {
  quizForm: FormGroup;
  quizId: number;
  categories: CategoryModel[];
  userImage: any;
  user: User | null;
  username: string | null = null;
  image: File | null = null;
  previewUrl: any = null;
  imageQuiz: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private userProfileService: UserProfileService,
    private sanitizer: DomSanitizer,
    public toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: [null, Validators.required],
      questions: this.fb.array([]),
    });

    this.userProfileService.getUserImage().subscribe(image => {
      this.userImage = image;
    });
    this.userProfileService.getUser().subscribe(user => {
      this.user = user;
      this.username = user?.username ?? null;
    });

    this.quizId = +this.route.snapshot.paramMap.get('id')!;

    if (this.quizId) {

      this.loadQuizDetails(this.quizId);
    }
  }

  /**
   * Charger les détails du quiz en fournissant un identifiant et initialiser le formulaire avec ces données.
   * De plus, si le champ categoryId du formulaire n'est pas défini, il sera par défaut défini sur l'id de la première catégorie dans la liste de toutes les catégories.
   *
   * @param id - Identifiant du quiz à charger.
   */
  loadQuizDetails(id: number): void {
    this.quizService.getQuizById(id)
      .pipe(
        tap(data => console.log('Data received in pipe:', data))
      )
      .subscribe(quizData => {
        console.log('Quiz Data:', quizData);
        this.categoryService.getAllCategories().subscribe(categories => {
          console.log(categories);
          this.categories = categories;

          // Utilisez la categoryId de quizData si elle est disponible; sinon, utilisez l'ID de la première catégorie
          let defaultCategoryId = quizData.categoryId ?? categories[0]?.id;

          if (defaultCategoryId) {
            this.quizForm.patchValue({
              categoryId: defaultCategoryId
            });
          }
        });

        this.initializeFormWithQuizData(quizData);
      });
  }

  /**
   * Initialise le formulaire avec les données fournies du quiz.
   *
   * @param quizData: any - Les données du quiz qui seront utilisées pour initialiser le formulaire.
   * quizData doit contenir les propriétés suivantes:
   * - title: string - Le titre du quiz.
   * - description: string - Une description du quiz.
   * - questions: array - Un tableau de questions du quiz, chaque question doit aussi contenir un tableau de réponses possibles.
   * - image: string - Une image du quiz encodée en base64.
   */
  initializeFormWithQuizData(quizData: any): void {
    console.log('Initializing form with quiz data:', quizData);
    const {title, description, questions, image} = quizData;
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Questions:', questions);
    console.log('Image:', image);
    // Transformez la chaîne image Base64 en URL sécurisée
    let imagePrefix: string;
    const imageType = this.detectImageType(image); // Détectez le type
    if (imageType === 'jpeg' || imageType === 'jpg') {
      imagePrefix = 'data:image/jpeg;base64,';
    } else if (imageType === 'png') {
      imagePrefix = 'data:image/png;base64,';
    } /*else if (imageType === 'gif') {
      imagePrefix = 'data:image/gif;base64,';
    }*/ else {
      imagePrefix = 'data:image/jpeg;base64,';
    }

    this.imageQuiz = this.sanitizer.bypassSecurityTrustResourceUrl(imagePrefix + image);
    // Initialiser le tableau des questions
    const questionFGs: FormGroup[] = questions.map((questionData: { answers: any[]; text: any; }) => {
      // Initialiser le tableau des réponses pour chaque question
      const answerFGs: FormGroup[] = questionData.answers.map(answerData => {
        return this.fb.group({
          text: [answerData.text, Validators.required],
          correct: [answerData.correct, Validators.required]
        });
      });

      return this.fb.group({
        text: [questionData.text, Validators.required],
        answers: this.fb.array(answerFGs),
      }, {validators: [hasCorrectAnswerValidator()]});
    });

    // Définir les valeurs du formulaire
    this.quizForm = this.fb.group({
      title: [title, Validators.required],
      description: [description, Validators.required],
      categoryId: [+this.categories, Validators.required],
      questions: this.fb.array(questionFGs),
      image: [this.imageQuiz]
    });
  }

  /**
   * Fonction pour détecter le type d'image à partir d'une chaîne Base64.
   *
   * @param imageBase64: string - La chaîne Base64 de l'image dont le type doit être détecté.
   * Cette chaîne doit représenter une image encodée en Base64 et doit commencer par une signature caractéristique de son type.
   * Par exemple, pour JPEG, elle pourrait commencer par '/9j/', et pour PNG, par 'iVBOR'.
   *
   * @returns string - Retourne une chaîne représentant le type de l'image détecté ('jpeg', 'png' ou 'unknown').
   */
  detectImageType(imageBase64: string): string {
    // Logique simple de détection de type - vous pourriez avoir besoin de plus de conditions pour d'autres types
    if (imageBase64.startsWith('/9j/')) {
      return 'jpeg'; // ou 'jpg'
    } else if (imageBase64.startsWith('iVBOR')) {
      return 'png';
    }
    // Ajoutez d'autres détections de type selon les besoins
    return 'unknown'; // ou un type par défaut
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

  get questionsArray() {
    return (this.quizForm.get('questions') as FormArray);
  }

  getAnswersArray(questionCtrl: AbstractControl): AbstractControl[] {
    return (questionCtrl.get('answers') as FormArray).controls;
  }

  onSubmit(): void {
    if (this.quizForm.valid) {
      const questions = this.quizForm.get('questions')?.value;
      const isValid = this.validateQuestions(questions);

      if (!isValid) {
        this.toastService.showToast('Each question must have at least one correct answer.', 'error');
        return;
      }

      // Create a new FormData object
      const formData: FormData = new FormData();

      // Append all other form data to formData
      formData.append('title', this.quizForm.get('title')?.value);
      formData.append('description', this.quizForm.get('description')?.value);
      formData.append('categoryId', this.quizForm.get('categoryId')?.value);
      // If you have nested form arrays, you might need to stringify them
      formData.append('questions', JSON.stringify(this.quizForm.get('questions')?.value));

      // Append the image to formData
      if (this.image) {
        formData.append('image', this.image, this.image.name);
      }

      // Call your quiz service to save the quiz details
      this.quizService.updateQuiz(this.quizId, formData).subscribe(response => {
        this.toastService.showToast('Votre quiz est mis à jour.', 'success');
        // Navigate to some other page upon success
        if (this.user) this.router.navigate(['/quiz-list-user', this.user?.id]);
      });
    }
  }

}

