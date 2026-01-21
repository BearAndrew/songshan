import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { routes } from '../../../app.routes';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { filter } from 'rxjs';
import {
  DropdownComponent,
  Option,
} from '../../components/dropdown/dropdown.component';
import { ApiService } from '../../../core/services/api-service.service';
import { Airport } from '../../../models/airport.model';
import { CommonService } from '../../../core/services/common.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [CommonModule, OverlayModule, DropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() theme: 'light' | 'dark' = 'light';

  currentUrl: string = '';
  menuOpen = false;
  menuRoutes: Array<{ path: string; title: string; theme: string }> = [];
  title: string = '';
  airportListData: Airport[] = [];
  airportList: Option[] = [];
  airportDefault = 'TSA'; // 台北
  isProd = environment.production;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getCurrentRouteTitle();
      });

    this.loadRoutes();
    this.getCurrentRouteTitle();
    // this.airportList.push({ label: '所有機場', value: -1, code: '' });
    this.loadAirportList();
  }

  ngOnInit(): void {
    // 取得當前 URL
    this.currentUrl = this.router.url;

    // 若路由會改變，也可以訂閱
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  // 判斷是否在 /traffic-analysis
  isTrafficAnalysisRoute(): boolean {
    return this.currentUrl.startsWith('/traffic-analysis');
  }

  /** 隱藏機場下拉選單 */
  isHideAirportDropdown(): boolean {
    const prefixes: string[] = ['/taxi-module', '/intl-checkin-counter'];

    return prefixes.some((prefix) => this.currentUrl.startsWith(prefix));
  }

  /** 讀取 app.routes.ts 的路由資訊 */
  loadRoutes() {
    const mainRoute = routes.find((r) => r.component === MainLayoutComponent);

    if (!mainRoute || !mainRoute.children) return;

    this.menuRoutes = mainRoute.children
      .filter((r) => r.path && r.data?.['title'])
      .map((r) => ({
        path: r.path!,
        title: r.data?.['title'] as string,
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

  closeMenu() {
    this.menuOpen = false;
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.closeMenu();
  }

  loadAirportList() {
    this.apiService.getAirportListTaiwan().subscribe((res) => {
      this.airportListData = res;
      this.airportListData.forEach((airport) => {
        this.airportList.push({
          label: airport.name_zhTW,
          value: airport.iata,
        });
      });
      this.airportList = [...this.airportList];
      this.commonService.setAirportList(this.airportList);
      this.commonService.setSelectedAirport(this.airportDefault);
    });
  }

  onAirportChange(option: Option) {
    this.commonService.setSelectedAirport(option.value);
  }
}
