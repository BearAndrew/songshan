import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { OVERLAY_DATA, OVERLAY_RESULT, OverlayData } from './message-dialog.inject-token';

@Component({
  selector: 'app-message-dialog',
  imports: [],
  templateUrl: './message-dialog.component.html',
  styleUrl: './message-dialog.component.scss'
})
export class MessageDialogComponent {
  title = '提示';
  message = '';
  confirmText = '';
  cancelText = '';

  constructor(
    @Inject(OVERLAY_DATA) public data: OverlayData,
    @Inject(OVERLAY_RESULT) private result$: Subject<boolean>
  ) {
    if (data?.title) this.title = data.title;
    if (data?.message) this.message = data.message;
    if (data?.confirmText) this.confirmText = data.confirmText;
    if (data?.cancelText) this.cancelText = data.cancelText;
  }

  onConfirm() {
    this.result$.next(true);
    this.result$.complete();
  }

  onCancel() {
    this.result$.next(false);
    this.result$.complete();
  }
}
