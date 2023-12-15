import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizChooseCatComponent } from './quiz-choose-cat.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: '<a [style.color]="textColor">Fake Logo</a>',
})
class AppLogoStubComponent {
  @Input() textColor: string;
}

describe('QuizChooseCatComponent', () => {
  let component: QuizChooseCatComponent;
  let fixture: ComponentFixture<QuizChooseCatComponent>;

  beforeEach(async(() => {
    const mockActivatedRoute = {};

    TestBed.configureTestingModule({
      declarations: [QuizChooseCatComponent, AppLogoStubComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizChooseCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
