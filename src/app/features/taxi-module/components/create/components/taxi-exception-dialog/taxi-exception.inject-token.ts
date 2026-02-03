import { InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';
import { TaxiException } from '../../../../../../models/taxi.model';

export interface TaxiExceptionOverlayData {
  taxiList?: TaxiException[]
}

export const OVERLAY_DATA = new InjectionToken<TaxiExceptionOverlayData>('OVERLAY_DATA');
export const OVERLAY_RESULT = new InjectionToken<Subject<boolean>>('OVERLAY_RESULT');
