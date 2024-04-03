import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SUPERHEROES } from '../../../mocks/superheroes.mock';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { SuperheroService } from '../superhero.service';
import { SuperheroDetailComponent } from './superhero-detail.component';

describe('SuperheroDetailComponent', () => {
  let component: SuperheroDetailComponent;
  let fixture: ComponentFixture<SuperheroDetailComponent>;

  beforeEach(async () => {
    const superheroServiceMock = {
      getSuperheroById: jasmine.createSpy('getSuperheroById').and.returnValue(of(SUPERHEROES.find((hero) => hero.id === 1))),
      addSuperhero: jasmine.createSpy('addSuperhero').and.returnValue(of(SUPERHEROES[0])),
      updateSuperhero: jasmine.createSpy('updateSuperhero').and.returnValue(of(SUPERHEROES[0])),
      deleteSuperhero: jasmine.createSpy('deleteSuperhero').and.returnValue(of({ message: 'Superhero deleted' })),
    };

    const notificationServiceMock = {
      showNotification: jasmine.createSpy('showNotification'),
    };

    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(1),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        MatChipsModule,
        SuperheroDetailComponent
      ],
      providers: [
        { provide: SuperheroService, useValue: superheroServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load superhero data if an id is provided', () => {
    expect(component.superhero).not.toBeNull();
    expect(
      TestBed.inject(SuperheroService).getSuperheroById
    ).toHaveBeenCalledWith(1);
  });

  it('should add a power to the form array on addPower', () => {
    const event = {
      value: 'Flight',
      chipInput: { inputElement: { value: '' } },
    };
    component.addPower(event as MatChipInputEvent);
    expect(component.powers.value).toContain('Flight');
  });  

  it('should call updateSuperhero on submit if id is present', () => {
    component.onSubmit();
    expect(TestBed.inject(SuperheroService).updateSuperhero).toHaveBeenCalled();
  });
});
