import { Component, Inject, Optional } from '@angular/core';
import {
  OVERLAY_DATA,
  OVERLAY_RESULT,
} from '../../../../../../shared/components/message-dialog/message-dialog.inject-token';
import { Subject } from 'rxjs';
import { TaxiException } from '../../../../../../models/taxi.model';
import { CommonModule } from '@angular/common';
import { TaxiExceptionOverlayData } from './taxi-exception.inject-token';

@Component({
  selector: 'app-taxi-exception-dialog',
  imports: [CommonModule],
  templateUrl: './taxi-exception-dialog.component.html',
  styleUrl: './taxi-exception-dialog.component.scss',
})
export class TaxiExceptionDialogComponent {
  taxiList: TaxiException[] = []; // NOTREG / BLACKLIST
  expandedPlate: string | null = null;

  constructor(
    @Inject(OVERLAY_DATA)
    @Optional()
    public data: TaxiExceptionOverlayData | null,
    @Inject(OVERLAY_RESULT)
    @Optional()
    private result$: Subject<boolean> | null,
  ) {
    if (data?.taxiList) {
      this.taxiList = data.taxiList;
    }
  }

  onConfirm() {
    if (this.result$) {
      this.result$.next(true);
      this.result$.complete();
    }
  }

  onCancel() {
    if (this.result$) {
      this.result$.next(false);
      this.result$.complete();
    }
  }

  toggle(regPlate: string) {
    this.expandedPlate = this.expandedPlate === regPlate ? null : regPlate;
  }
}
