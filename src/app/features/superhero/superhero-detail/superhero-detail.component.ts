import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Superhero } from '../../../models/superhero.model';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDiscardChangesDialogComponent } from '../../../shared/components/confirm-discard-changes-dialog/confirm-discard-changes-dialog.component';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { minArrayLength } from '../../../shared/validators/custom-validators';
import { SuperheroService } from '../superhero.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';

@Component({
  selector: 'app-superhero-detail',
  templateUrl: './superhero-detail.component.html',
  styleUrl: './superhero-detail.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule
  ],
})
export class SuperheroDetailComponent {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  private unsubscribe$ = new Subject<void>();

  superheroForm!: FormGroup;
  superhero: Superhero | null = null;
  isNew: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private superheroService: SuperheroService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private notification: NotificationService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.spinnerService.show();
    this.superheroForm = this.fb.group({
      name: ['', Validators.required],
      team: ['', Validators.required],
      powers: this.fb.array([], minArrayLength(1)),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSuperhero(id);
      this.isNew = false;
    } else {
      this.spinnerService.hide();
    }

    this.powers.valueChanges.subscribe(() => {
      if (!this.superheroForm.dirty) {
        this.superheroForm.markAsDirty();
      }
    });
  }

  onSubmit(): void {
    if (!this.superheroForm.valid) {
      this.notification.showNotification('Debes rellenar todos los campos para continuar');
      return;
    }

    this.spinnerService.show();
    const isUpdating = this.superhero && this.superhero.id;
    const operation$ = isUpdating
      ? this.superheroService.updateSuperhero({
          ...this.superheroForm.value,
          id: this.superhero?.id,
        })
      : this.superheroService.addSuperhero(this.superheroForm.value);

    const operationName = isUpdating ? 'actualizado' : 'creado';
    const message = `Superhéroe ${operationName} correctamente`;

    operation$.pipe(
      finalize(() => this.spinnerService.hide())
    ).subscribe({
      next: () => {
        this.notification.showNotification(message);
        this.router.navigate(['/superheroes']);
      },
      error: (error) => this.notification.showNotification(error.message),
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get powers() {
    return this.superheroForm.get('powers') as FormArray;
  }

  loadSuperhero(id: string): void {
    this.superheroService
      .getSuperheroById(+id)
      .pipe(
        finalize(() => this.spinnerService.hide()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: (superhero) => {
          this.superhero = superhero;

          this.superheroForm.patchValue({
            name: superhero.name,
            team: superhero.team,
          });
          superhero.powers.forEach((power) =>
            this.powers.push(this.fb.control(power))
          );
        },
        error: (error) => this.notification.showNotification(error.message),
      });
  }

  //#region power
  addPower(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.powers.push(this.fb.control(value));
    }

    if (event.chipInput) {
      event.chipInput.inputElement.value = '';
    }
  }

  removePower(power: string): void {
    const index = this.powers.value.indexOf(power);
    if (index >= 0) {
      this.powers.removeAt(index);
    }
  }

  editPower(power: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    const index = this.powers.value.indexOf(power);

    if (!value) {
      if (index >= 0) {
        this.removePower(power);
      }
    } else if (index >= 0) {
      const control = this.powers.at(index);
      control.setValue(value);
      control.markAsDirty();
    }
  }
  //#endregion power

  //#region come back
  comeBack(): void {
    this.shouldNavigateAway()
      .pipe(
        filter((hasAccepted) => hasAccepted),
        switchMap(() => {
          return this.router.navigate(['/superheroes']);
        })
      )
      .subscribe();
  }

  private shouldNavigateAway(): Observable<boolean> {
    if (!this.superheroForm.dirty) {
      return of(true);
    }

    const dialogRef = this.dialog.open(ConfirmDiscardChangesDialogComponent);
    return dialogRef.afterClosed();
  }
  //#endregion come back

  //#region delete
  deleteSuperhero(): void {
    if (!this.superhero?.id) {
      this.notification.showNotification('Superhéroe no existe');
      return;
    }
    
    this.spinnerService.show();
    this.shouldConfirmDelete()
      .pipe(
        filter((hasConfirmed) => hasConfirmed),
        switchMap(() =>
          this.superheroService.deleteSuperhero(this.superhero!.id)
        ),
        tap({
          next: () => {
            this.notification.showNotification(
              'Superhéroe eliminado correctamente'
            );
            this.router.navigate(['/superheroes']);
          },
          error: (error) =>
            this.notification.showNotification(`Error al eliminar el superhéroe: ${error.toString()}`
            ),
          finalize: () => this.spinnerService.hide()
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
