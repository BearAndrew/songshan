import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

/**
 * 國際線報到櫃檯重置專用 layout。
 * 與 main-layout 不同處:header 採「正常流」(非 fixed),
 * 內容區自身為捲動容器 → 頁面內 position:sticky(top:0)可正常運作,
 * 不會被 fixed header 切到。其餘行為(主題)與 main-layout 一致。
 */
@Component({
  selector: 'app-counter-reset-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './counter-reset-layout.component.html',
  styleUrl: './counter-reset-layout.component.scss',
})
export class CounterResetLayoutComponent implements OnInit {
  theme: 'light' | 'dark' = 'dark';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.applyThemeFromRoute(this.getChild(this.route).snapshot.data);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.applyThemeFromRoute(this.getChild(this.route).snapshot.data);
      });
  }

  private applyThemeFromRoute(data: any): void {
    this.theme = data['theme'] || 'dark';
  }

  private getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) route = route.firstChild;
    return route;
  }
}
