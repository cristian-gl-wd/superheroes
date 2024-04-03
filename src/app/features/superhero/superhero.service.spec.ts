import { TestBed } from '@angular/core/testing';

import { SuperheroService } from './superhero.service';
import { Superhero } from '../../models/superhero.model';
import { SUPERHEROES } from '../../mocks/superheroes.mock';

describe('SuperheroService', () => {
  let service: SuperheroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperheroService);
    service['superheroes'] = [...SUPERHEROES];
  });

  it('should return all superheroes', (done: DoneFn) => {
    service.getAllSuperheroes().subscribe(superheroes => {
      expect(superheroes.length).toBeGreaterThan(0);
      expect(superheroes).toEqual(SUPERHEROES);
      done();
    });
  });

  it('should return a superhero when a valid ID is provided', (done: DoneFn) => {
    const testId = 1;
    service.getSuperheroById(testId).subscribe(superhero => {
      expect(superhero).toBeTruthy();
      expect(superhero.id).toBe(testId);
      expect(superhero.name).toEqual('Spiderman');
      expect(superhero.powers).toContain('Superfuerza');
      expect(superhero.team).toEqual('Vengadores');
      done();
    });
  });

  it('should add a new superhero and assign a unique ID', (done: DoneFn) => {
    const newSuperhero: Superhero = { id: 8, name: 'Test Hero', powers: ['Power test'], team: 'Test team' };
    service.addSuperhero(newSuperhero).subscribe(addedSuperhero => {
      expect(addedSuperhero.id).not.toBe(0);
      service.getAllSuperheroes().subscribe(superheroes => {
        expect(superheroes.find(hero => hero.id === addedSuperhero.id)).toBeTruthy();
        done();
      });
    });
  });

  it('should update the superhero with the given ID', (done: DoneFn) => {
    const updateSuperhero: Superhero = { id: 1, name: 'Updated Hero', powers: ['Power test'], team: 'Test team' };
    service.updateSuperhero(updateSuperhero).subscribe(updated => {
      expect(updated).toEqual(updateSuperhero);
      done();
    });
  });

  it('should delete the superhero with the specified ID and it should not be present after deletion', (done: DoneFn) => {
    const deleteId = 3;
    service.deleteSuperhero(deleteId).subscribe({
      next: (response) => {
        expect(response).toEqual({ message: '¡Superheroe eliminado correctamente!' });
        service.getAllSuperheroes().subscribe(superheroes => {
          expect(superheroes.find(hero => hero.id === deleteId)).toBeFalsy();
          done();
        });
      },
      error: (error) => {
        expect(error).toBeUndefined();
        done();
      }
    });
  });
});
