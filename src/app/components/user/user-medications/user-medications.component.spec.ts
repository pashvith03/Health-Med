import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMedicationsComponent } from './user-medications.component';

describe('UserMedicationsComponent', () => {
  let component: UserMedicationsComponent;
  let fixture: ComponentFixture<UserMedicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMedicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMedicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
