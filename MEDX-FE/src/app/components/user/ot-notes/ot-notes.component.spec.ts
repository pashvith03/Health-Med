import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtNotesComponent } from './ot-notes.component';

describe('OtNotesComponent', () => {
  let component: OtNotesComponent;
  let fixture: ComponentFixture<OtNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
