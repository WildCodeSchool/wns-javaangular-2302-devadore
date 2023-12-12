import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizListUserComponent } from './quiz-list-user.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: '<a [style.color]="textColor">Fake Logo</a>',
})
class AppLogoStubComponent {
  @Input() textColor: string;
}

describe('QuizListUserComponent', () => {
  let component: QuizListUserComponent;
  let fixture: ComponentFixture<QuizListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizListUserComponent, AppLogoStubComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
