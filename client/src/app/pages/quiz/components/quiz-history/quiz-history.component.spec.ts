import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHistoryComponent } from './quiz-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Component, Input } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-logo',
  template: '<a [style.color]="textColor">Fake Logo</a>'
})
class AppLogoStubComponent {
  @Input() textColor: string;
}

describe('QuizHistoryComponent', () => {
  let component: QuizHistoryComponent;
  let fixture: ComponentFixture<QuizHistoryComponent>;

  const activatedRouteStub = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizHistoryComponent, AppLogoStubComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule, MatPaginatorModule, MatTableModule, BrowserAnimationsModule ],
      providers: [ 
        { provide: ActivatedRoute, useValue: activatedRouteStub } 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
