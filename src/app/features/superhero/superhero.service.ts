import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { Superhero } from '../../models/superhero.model';
import { SUPERHEROES } from '../../mocks/superheroes.mock';

@Injectable({
  providedIn: 'root'
})

export class SuperheroService {
  private superheroes: Superhero[] = SUPERHEROES;

  constructor() { }

  private getLastId(): number {
    if (this.superheroes.length === 0) {
      return 0;
    }
    const maxId = Math.max(...this.superheroes.map(superhero => superhero.id));
    return maxId + 1;
  }

  getAllSuperheroes(): Observable<Superhero[]> {
    return of(this.superheroes);
  }

  getSuperheroById(id: number): Observable<Superhero> {
    const filteredSuperhero = this.superheroes.find(superhero => superhero.id === id);
    if (!filteredSuperhero) {
      return throwError(() => new Error('¡Superheroe no encontrado!'));
    }
    return of(filteredSuperhero);
  }

  addSuperhero(newSuperhero: Superhero): Observable<Superhero> {
    newSuperhero.id = this.getLastId() + 1;
    this.superheroes = [...this.superheroes, newSuperhero];
    return of(newSuperhero);
  }

  updateSuperhero(updatedSuperhero: Superhero): Observable<Superhero> {
    const i = this.superheroes.findIndex(superhero => superhero.id === updatedSuperhero.id);
    if (i === -1) {
      return throwError(() => new Error('¡Error al actualizar! Superheroe a modificar no encontrado'));
    }
    this.superheroes = [
      ...this.superheroes.slice(0, i),
      updatedSuperhero,
      ...this.superheroes.slice(i + 1)
    ];
    return of(updatedSuperhero);
  }

  deleteSuperhero(id: number): Observable<{}> {
    const i = this.superheroes.findIndex(superhero => superhero.id === id);
    if (i === -1) {
      return throwError(() => new Error('¡Error al eliminar! Superheroe a eliminar no encontrado'));
    }
    this.superheroes = [
      ...this.superheroes.slice(0, i),
      ...this.superheroes.slice(i + 1)
    ];
    return of({ message: '¡Superheroe eliminado correctamente!' });
  }
}