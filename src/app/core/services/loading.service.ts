import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingOverlayComponent } from '../../shared/components/loading-overlay/loading-overlay.component';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = 0;
  private overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay, private injector: Injector) {}

  /** 增加 loading count */
  show(apiName?: string) {
    this.loadingCount++;
    console.log(`Loading show (${apiName || 'unknown API'}), count = ${this.loadingCount}`);
    this.updateOverlay();
  }

  /** 減少 loading count */
  hide(apiName?: string) {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }
    console.log(`Loading hide (${apiName || 'unknown API'}), count = ${this.loadingCount}`);
    this.updateOverlay();
  }

  /** 更新 overlay 狀態 */
  private updateOverlay() {
    if (this.loadingCount > 0) {
      if (!this.overlayRef) {
        this.overlayRef = this.overlay.create({
          hasBackdrop: true,
          positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
          scrollStrategy: this.overlay.scrollStrategies.block(),
        });
        const portal = new ComponentPortal(LoadingOverlayComponent, null, this.injector);
        this.overlayRef.attach(portal);
      }
    } else {
      if (this.overlayRef) {
        this.overlayRef.detach();
        this.overlayRef.dispose();
        this.overlayRef = null;
      }
    }
  }
}
