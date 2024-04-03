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
import { RouterLink } from '@angular/router';

import { Superhero } from '../../../models/superhero.model';
import { NotificationService } from '../../../shared/services/notification.service';
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
    private notification: NotificationService
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

  filterByName(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteSuperhero(superhero: Superhero) {
    this.superheroService.deleteSuperhero(superhero.id).subscribe({
      next: (result: any) => {
        this.notification.showNotification(result.message);
        this.loadSuperheroes();
      },
      error: (error) => this.notification.showNotification(error.toString()),
    });
  }
}
