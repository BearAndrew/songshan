import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fromEvent, startWith, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
