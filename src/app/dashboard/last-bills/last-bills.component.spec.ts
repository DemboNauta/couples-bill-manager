import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastBillsComponent } from './last-bills.component';

describe('LastBillsComponent', () => {
  let component: LastBillsComponent;
  let fixture: ComponentFixture<LastBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastBillsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LastBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
