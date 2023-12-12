import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizPlayComponent } from './quiz-play.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { QuizMusicService } from 'src/app/services/quiz-music.service';

class MockQuizMusicService {
  playMusic() {}
  stopMusic() {}
}

@Component({
  selector: 'app-logo',
  template: '<a [style.color]="textColor">Fake Logo</a>'
})
class AppLogoStubComponent {
  @Input() textColor: string;
}

describe('QuizPlayComponent', () => {
  let component: QuizPlayComponent;
  let fixture: ComponentFixture<QuizPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        QuizPlayComponent,
        AppLogoStubComponent
       ],
      imports: [ 
        RouterTestingModule,
        HttpClientTestingModule
       ],
       providers: [
        { provide: QuizMusicService, useClass: MockQuizMusicService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
