import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsGraphsComponent } from './bills-graphs.component';

describe('BillsGraphsComponent', () => {
  let component: BillsGraphsComponent;
  let fixture: ComponentFixture<BillsGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillsGraphsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
