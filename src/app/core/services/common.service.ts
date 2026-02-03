import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, fromEvent, map, Observable, startWith, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, ComponentType } from '@angular/cdk/portal';
import { MessageDialogComponent } from '../../shared/components/message-dialog/message-dialog.component';
import { OVERLAY_DATA, OVERLAY_RESULT, OverlayData } from '../../shared/components/message-dialog/message-dialog.inject-token';
import { Option } from '../../shared/components/dropdown/dropdown.component';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  private airportList: Option[] = [];
  private selectedAirport$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  setAirportList(data: Option[]) {
    this.airportList = data;
  }

  getAirportList() {
    return this.airportList;
  }

  /** 設定選擇的機場代碼 */
  setSelectedAirport(airportCode: string) {
    this.selectedAirport$.next(airportCode);
  }

  /** 取得選擇的機場代碼 */
  getSelectedAirport(): Observable<string> {
    return this.selectedAirport$.asObservable();
  }

  /** 取得選擇的機場名稱 */
  getSelectedAirportName(airportCode: string): string {
    return this.airportList.find(item => item.value == airportCode)?.label || '';
  }

  observeScreenSize() {
    return fromEvent(window, 'resize').pipe(
      startWith(null),
      map(() => {
        const width = window.innerWidth;

        if (width < 640) {
          return 'sm';
        }

        if (width >= 1024) {
          return 'lg';
        }

        return 'md';
      })
    );
  }

  /** 開啟彈窗 */
  openDialog(data: OverlayData) {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    const result$ = new Subject<boolean>();

    const injectorTokens = new WeakMap();
    injectorTokens.set(OVERLAY_DATA, data);
    injectorTokens.set(OVERLAY_RESULT, result$);

    const portalInjector = new PortalInjector(this.injector, injectorTokens);
    const portal = new ComponentPortal(MessageDialogComponent, null, portalInjector);
    overlayRef.attach(portal);

    overlayRef.backdropClick().pipe(take(1)).subscribe(() => {
      result$.next(false);
      result$.complete();
    });

    // dispose overlay when result emits or completes
    result$.pipe(take(1)).subscribe({
      next: () => overlayRef.dispose(),
      complete: () => overlayRef.dispose(),
    });

    return result$.asObservable();
  }

  /**
   * 開啟任意 component 的 overlay
   * - component: 要開啟的 Component class
   * - data: 傳入 overlay 的資料（optional）
   * 回傳 Observable，當 component 透過注入的 OVERLAY_RESULT 發出值或完成時 overlay 會自動 dispose。
   */
  openCustomDialog<T, R = any>(component: ComponentType<T>, data?: any) {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    const result$ = new Subject<R | null>();

    const injectorTokens = new WeakMap();
    injectorTokens.set(OVERLAY_DATA, data);
    injectorTokens.set(OVERLAY_RESULT, result$);

    const portalInjector = new PortalInjector(this.injector, injectorTokens);
    const portal = new ComponentPortal(component, null, portalInjector);
    overlayRef.attach(portal);

    overlayRef.backdropClick().pipe(take(1)).subscribe(() => {
      // 使用 null 表示使用者透過 backdrop 關閉
      result$.next(null);
      result$.complete();
    });

    // dispose overlay when result emits or completes
    result$.pipe(take(1)).subscribe({
      next: () => overlayRef.dispose(),
      complete: () => overlayRef.dispose(),
    });

    return result$.asObservable();
  }
}
