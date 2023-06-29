import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedSlideComponent } from './animated-slide.component';

describe('AnimatedSlideComponent', () => {
  let component: AnimatedSlideComponent;
  let fixture: ComponentFixture<AnimatedSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimatedSlideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
