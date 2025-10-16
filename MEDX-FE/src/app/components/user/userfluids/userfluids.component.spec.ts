import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserfluidsComponent } from './userfluids.component';

describe('UserfluidsComponent', () => {
  let component: UserfluidsComponent;
  let fixture: ComponentFixture<UserfluidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserfluidsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserfluidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
