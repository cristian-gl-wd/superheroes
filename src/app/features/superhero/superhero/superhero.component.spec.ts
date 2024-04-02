import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperheroComponent } from './superhero.component';

describe('SuperheroComponent', () => {
  let component: SuperheroComponent;
  let fixture: ComponentFixture<SuperheroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperheroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuperheroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
