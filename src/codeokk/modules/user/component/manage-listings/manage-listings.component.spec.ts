import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageListingsComponent } from './manage-listings.component';

describe('ManageListingsComponent', () => {
  let component: ManageListingsComponent;
  let fixture: ComponentFixture<ManageListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageListingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
