import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, fromEvent, map, startWith, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
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

  setSelectedAirport(airportCode: string) {
    this.selectedAirport$.next(airportCode);
  }

  getSelectedAirport() {
    return this.selectedAirport$.asObservable();
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

  // open a message dialog using CDK overlay and return observable<boolean>
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
}
