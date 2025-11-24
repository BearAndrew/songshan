import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { routes } from '../../../app.routes';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, OverlayModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() theme: 'light' | 'dark' = 'light';

  menuOpen = false;
  menuRoutes: Array<{ path: string; title: string; theme: string }> = [];
  title: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.loadRoutes();
    this.getCurrentRouteTitle();
  }

  /** 讀取 app.routes.ts 的路由資訊 */
  loadRoutes() {
    const mainRoute = routes.find((r) => r.component === MainLayoutComponent);

    if (!mainRoute || !mainRoute.children) return;

    this.menuRoutes = mainRoute.children
      .filter((r) => r.path && r.title)
      .map((r) => ({
        path: r.path!,
        title: r.title as string,
        theme: r.data?.['theme'] ?? 'light',
      }));
  }

  /** 獲取當前路由的 title */
  getCurrentRouteTitle() {
    // 遍歷至最深層的子路由
    let currentRoute = this.activatedRoute;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    currentRoute.data.subscribe((data) => {
      this.title = data['title'] || '';
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.closeMenu();
  }
}
