import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlowSheetComponent } from './user-flow-sheet.component';

describe('UserFlowSheetComponent', () => {
  let component: UserFlowSheetComponent;
  let fixture: ComponentFixture<UserFlowSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFlowSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFlowSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
