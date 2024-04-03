import { TestBed } from '@angular/core/testing';
import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show the spinner', (done: DoneFn) => {
    service.isLoading.subscribe(isLoading => {
      if (isLoading) {
        expect(isLoading).toBeTrue();
        done();
      }
    });
    service.show();
  });

  it('should hide the spinner', (done: DoneFn) => {
    service.hide();
    service.show();

    service.isLoading.subscribe(isLoading => {
      if (!isLoading) {
        expect(isLoading).toBeFalse();
        done();
      }
    });
    service.hide();
  });
});
