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
  private resizeSub!: Subscription;

  ngOnInit(): void {
    this.resizeSub = fromEvent(window, 'resize')
      .pipe(startWith(null))
      .subscribe(() => {
        this.applyZoom();
      });
  }

  ngOnDestroy(): void {
    this.resizeSub?.unsubscribe();
  }

  private applyZoom(): void {
    const width = window.innerWidth;

    // 小於 sm：恢復正常
    if (width < 640) {
      document.body.style.zoom = '1';
      return;
    }

    // xl 以上：不縮放
    if (width >= 1280) {
      document.body.style.zoom = '1';
      return;
    }

    // sm ~ xl：線性縮放
    const minWidth = 640;
    const maxWidth = 1280;

    const scale = width / maxWidth;

    document.body.style.zoom = scale.toFixed(3);
  }
}
