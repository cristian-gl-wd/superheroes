import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  isLoading = this.spinnerService.isLoading;

  constructor(private spinnerService: SpinnerService) { }
}