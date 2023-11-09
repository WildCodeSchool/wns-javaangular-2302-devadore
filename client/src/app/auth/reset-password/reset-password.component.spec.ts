import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: '<a [style.color]="textColor">Fake Logo</a>'
})
class AppLogoStubComponent {
  @Input() textColor: string;
}

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  const activatedRouteStub = {
    snapshot: {
      queryParamMap: {
        get: () => 'fake-token-for-testing' 
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ResetPasswordComponent,
        AppLogoStubComponent 
      ],
      imports: [ 
        HttpClientTestingModule, 
        ReactiveFormsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
