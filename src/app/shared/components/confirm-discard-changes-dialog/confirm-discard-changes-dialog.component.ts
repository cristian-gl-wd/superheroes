import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-discard-changes-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './confirm-discard-changes-dialog.component.html'
})
export class ConfirmDiscardChangesDialogComponent {

  constructor(public dialog: MatDialog) {}

}