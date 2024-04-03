import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SuperheroComponent } from './superhero.component';

describe('SuperheroComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SuperheroComponent
      ]
    }).compileComponents();
  });

  it('should create the superhero component', () => {
    const fixture = TestBed.createComponent(SuperheroComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
