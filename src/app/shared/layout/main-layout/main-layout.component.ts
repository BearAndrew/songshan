import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {

  theme: 'light' | 'dark' = 'light';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // 先讀取「初始化時」當下的 route data
    this.applyThemeFromRoute(this.getChild(this.route).snapshot.data);

    // 再監聽 NavigationEnd，在切換路由時更新主題
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.getChild(this.route);
        this.applyThemeFromRoute(child.snapshot.data);
      });
  }

  // route data 套用 theme
  private applyThemeFromRoute(data: any) {
    const theme = data['theme'] || 'light';
    this.theme = theme;
  }

  // 取得最深層 child route
  private getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
