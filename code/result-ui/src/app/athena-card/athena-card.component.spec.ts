import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaCardComponent } from './athena-card.component';

describe('AthenaCardComponent', () => {
  let component: AthenaCardComponent;
  let fixture: ComponentFixture<AthenaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthenaCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AthenaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
