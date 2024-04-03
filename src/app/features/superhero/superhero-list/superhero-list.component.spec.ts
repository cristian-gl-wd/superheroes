import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SUPERHEROES } from '../../../mocks/superheroes.mock';
import { NotificationService } from '../../../shared/services/notification.service';
import { SuperheroService } from '../superhero.service';
import { SuperheroListComponent } from './superhero-list.component';

describe('SuperheroListComponent', () => {
  let component: SuperheroListComponent;
  let fixture: ComponentFixture<SuperheroListComponent>;
  let superheroServiceMock: any;
  let notificationServiceMock: any;

  beforeEach(async () => {
    superheroServiceMock = {
      getAllSuperheroes: jasmine
        .createSpy('getAllSuperheroes')
        .and.returnValue(of(SUPERHEROES)),
      deleteSuperhero: jasmine
        .createSpy('deleteSuperhero')
        .and.returnValue(of({ message: 'Superhero successfully deleted!' })),
    };

    notificationServiceMock = {
      showNotification: jasmine.createSpy('showNotification'),
    };

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatButtonModule,
        MatChipsModule,
        MatInputModule,
        RouterTestingModule,
        SuperheroListComponent,
      ],
      providers: [
        { provide: SuperheroService, useValue: superheroServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load superheroes on init', () => {
    expect(superheroServiceMock.getAllSuperheroes).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(SUPERHEROES);
  });

  it('should filter superheroes by name', () => {
    const inputEvent = {
      target: { value: 'Batman' },
    } as unknown as Event;

    component.filterByName(inputEvent);

    expect(component.dataSource.filter).toEqual('batman');
  });

  it('should delete a superhero and reload the list', () => {
    const testSuperhero = SUPERHEROES[0];
    component.deleteSuperhero(testSuperhero);
    expect(superheroServiceMock.deleteSuperhero).toHaveBeenCalledWith(
      testSuperhero.id
    );
    fixture.whenStable().then(() => {
      expect(superheroServiceMock.getAllSuperheroes).toHaveBeenCalledTimes(2);
    });
  });
});
