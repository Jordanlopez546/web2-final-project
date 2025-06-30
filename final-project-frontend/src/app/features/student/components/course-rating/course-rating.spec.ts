import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRating } from './course-rating';

describe('CourseRating', () => {
  let component: CourseRating;
  let fixture: ComponentFixture<CourseRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseRating]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseRating);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
