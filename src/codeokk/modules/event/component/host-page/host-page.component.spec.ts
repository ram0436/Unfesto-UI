import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPageComponent } from './host-page.component';

describe('HostPageComponent', () => {
  let component: HostPageComponent;
  let fixture: ComponentFixture<HostPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
