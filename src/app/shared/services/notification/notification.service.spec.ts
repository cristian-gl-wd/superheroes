import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    const snackBarMock = {
      open: jasmine.createSpy('open')
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    });

    service = TestBed.inject(NotificationService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should call MatSnackBar.open with the correct message, action, and configuration', () => {
    const testMessage = 'Test Message';
    service.showNotification(testMessage);
  
    expect(snackBar.open).toHaveBeenCalledWith(testMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['info-snackbar'],
    });
  });
});
