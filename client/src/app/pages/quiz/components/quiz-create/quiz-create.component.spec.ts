import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCreateComponent } from './quiz-create.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: '<a [style.color]="textColor">Fake Logo</a>'
})
class AppLogoStubComponent {
  @Input() textColor: string;
}

describe('QuizCreateComponent', () => {
  let component: QuizCreateComponent;
  let fixture: ComponentFixture<QuizCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        QuizCreateComponent,
        AppLogoStubComponent
        ],
      imports: [ 
        HttpClientTestingModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
