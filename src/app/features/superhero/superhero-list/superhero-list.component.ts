import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
import { Router, RouterLink } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { Superhero } from '../../../models/superhero.model';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { NotificationService } from '../../../shared/services/notification/notification.service';
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

  constructor(
    private superheroService: SuperheroService,
    private notification: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSuperheroes();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  loadSuperheroes(): void {
    this.superheroService.getAllSuperheroes().subscribe({
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
        switchMap(() =>
          this.superheroService.deleteSuperhero(superhero.id)
        ),
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
