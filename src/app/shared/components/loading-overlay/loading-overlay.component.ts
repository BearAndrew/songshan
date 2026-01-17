import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  template: `
    <div class="flex items-center justify-center w-screen h-screen bg-black opacity-20 pointer-events-none">
      <div class="animate-spin rounded-full border-4 border-t-blue-500 w-12 h-12"></div>
    </div>
  `,
  standalone: true, // 如果 Angular 15+ 可以用 standalone
})
export class LoadingOverlayComponent {}
