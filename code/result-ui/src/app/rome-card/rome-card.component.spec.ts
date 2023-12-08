import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RomeCardComponent } from './rome-card.component';

describe('RomeCardComponent', () => {
  let component: RomeCardComponent;
  let fixture: ComponentFixture<RomeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RomeCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RomeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
