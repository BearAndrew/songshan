import { InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';

export interface OverlayData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export const OVERLAY_DATA = new InjectionToken<OverlayData>('OVERLAY_DATA');
export const OVERLAY_RESULT = new InjectionToken<Subject<boolean>>('OVERLAY_RESULT');
