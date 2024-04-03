import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { Superhero } from '../../../models/superhero.model';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SuperheroService } from '../superhero.service';

@Component({
  selector: 'app-superhero-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatInputModule,
    RouterLink,
    MatChipsModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './superhero-list.component.html',
  styleUrl: './superhero-list.component.css',
})
export class SuperheroListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Superhero>;
  dataSource = new MatTableDataSource<Superhero>([]);

  displayedColumns: string[] = ['name', 'powers', 'team', 'actions'];

  @ViewChild('searchInputHero') searchInputHero: ElementRef<HTMLInputElement> | undefined;
  
  constructor(
    private superheroService: SuperheroService,
    private notification: NotificationService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.spinnerService.show();
    this.loadSuperheroes();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    if (this.searchInputHero) {
      fromEvent(this.searchInputHero.nativeElement, 'input').pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(value => {
        this.filterByName(value.toUpperCase());
      });
    }
  }

  loadSuperheroes(): void {
    this.superheroService.getAllSuperheroes().pipe(
      finalize(() => this.spinnerService.hide())
    ).subscribe({
      next: (superheroes) => (this.dataSource.data = [...superheroes]),
      error: () =>
        this.notification.showNotification('Error cargando superhéroes'),
    });
  }

  filterByName(heroName: string) {
    this.dataSource.filter = heroName.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region delete
  deleteSuperhero(superhero: Superhero): void {
    this.shouldConfirmDelete()
      .pipe(
        filter((hasConfirmed) => hasConfirmed),
        switchMap(() => this.superheroService.deleteSuperhero(superhero.id)),
        tap({
          next: () => {
            this.loadSuperheroes();
            this.notification.showNotification('Superhéroe eliminado correctamente');
          },
          error: (error) =>
            this.notification.showNotification(`Error al eliminar el superhéroe: ${error.toString()}`
            ),
        })
      )
      .subscribe();
  }

  private shouldConfirmDelete(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);
    return dialogRef.afterClosed();
  }
  //#endregion delete
}
