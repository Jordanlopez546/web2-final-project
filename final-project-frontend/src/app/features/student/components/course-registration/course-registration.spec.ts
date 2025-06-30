import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRegistration } from './course-registration';

describe('CourseRegistration', () => {
  let component: CourseRegistration;
  let fixture: ComponentFixture<CourseRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
