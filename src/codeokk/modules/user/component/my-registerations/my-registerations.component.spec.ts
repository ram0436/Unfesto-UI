import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRegisterationsComponent } from './my-registerations.component';

describe('MyRegisterationsComponent', () => {
  let component: MyRegisterationsComponent;
  let fixture: ComponentFixture<MyRegisterationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRegisterationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRegisterationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
