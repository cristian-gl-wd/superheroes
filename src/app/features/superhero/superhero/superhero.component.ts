import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-superhero',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './superhero.component.html',
  styleUrl: './superhero.component.css'
})
export class SuperheroComponent {}
