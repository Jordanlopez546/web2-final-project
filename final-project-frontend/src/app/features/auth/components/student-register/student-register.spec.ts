import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRegisterComponent } from './student-register.component';

describe('StudentRegister', () => {
  let component: StudentRegisterComponent;
  let fixture: ComponentFixture<StudentRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
