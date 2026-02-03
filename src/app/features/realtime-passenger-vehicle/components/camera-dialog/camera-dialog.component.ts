import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { OVERLAY_DATA, OVERLAY_RESULT } from '../../../../shared/components/message-dialog/message-dialog.inject-token';

export interface CameraImage {
  src: string;
  label?: string;
  pointIndex?: number;
  imageIndex?: number;
}

export interface CameraDialogData {
  imgList?: CameraImage[];
}

@Component({
  selector: 'app-camera-dialog',
  imports: [CommonModule],
  templateUrl: './camera-dialog.component.html',
  styleUrl: './camera-dialog.component.scss'
})
export class CameraDialogComponent {
  imgList: CameraImage[] = [];

  constructor(
    @Inject(OVERLAY_DATA)
    @Optional()
    public data: any | null,
    @Inject(OVERLAY_RESULT)
    @Optional()
    private result$: Subject<boolean> | null,
  ) {
    const d = data as CameraDialogData | undefined | null;
    if (d?.imgList) {
      this.imgList = d.imgList;
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

}
