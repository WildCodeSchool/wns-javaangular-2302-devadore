import { Component, OnInit } from '@angular/core';
import { CategoryModel } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoomWebsocketService } from 'src/app/services/room-websocket.service';
import { Room } from 'src/app/models/room.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {

  roomForm: FormGroup;
  newRoom: Room = new Room();
  categorieList: CategoryModel[];
  creator: string;
  faPlus = faPlus;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private roomWebsocketService: RoomWebsocketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((res) => {
      this.categorieList = res;
      console.log(this.categorieList);
    });
    
    this.initForm();

    const token = this.authService.getToken();
    if(token){
      const decodedToken = this.authService.decodeToken(token);
      this.creator = decodedToken.sub;
    } else {
      console.log("Pas de token");
    }
  }

  initForm(): FormGroup {
    return this.roomForm = this.fb.group({
      name: new FormControl('', Validators.required),
      categorie: new FormControl('', Validators.required),
    });
  }

  onSubmit(): void {
    this.newRoom = this.roomForm.value;
    this.newRoom.creator = this.creator;

    if(this.creator){
      this.roomWebsocketService.createRoom(this.newRoom);
      this.router.navigate(['/multijoueur/waiting-room']);
    } else {
      throw new Error('Créateur de la room inconnu');
    }
  }
}
